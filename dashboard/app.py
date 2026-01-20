"""
MedPredict AI - Streamlit Dashboard

Interactive dashboard for:
- Expiry risk monitoring
- Stockout alerts
- Inventory health overview
- Actionable recommendations
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.ml.predictor import MedPredictEngine

# Page config
st.set_page_config(
    page_title="MedPredict AI",
    page_icon="💊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1E3A5F;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1rem;
        color: #6B7280;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 1rem;
        color: white;
    }
    .risk-critical {
        background-color: #FEE2E2;
        border-left: 4px solid #DC2626;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .risk-high {
        background-color: #FEF3C7;
        border-left: 4px solid #F59E0B;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .risk-medium {
        background-color: #DBEAFE;
        border-left: 4px solid #3B82F6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .risk-low {
        background-color: #D1FAE5;
        border-left: 4px solid #10B981;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .stMetric {
        background-color: #F8FAFC;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid #E2E8F0;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_data
def load_data():
    """Load and cache data"""
    data_dir = Path(__file__).parent.parent / "data"
    
    consumption_df = pd.read_csv(data_dir / "consumption_log.csv")
    inventory_df = pd.read_csv(data_dir / "current_inventory.csv")
    medicines_df = pd.read_csv(data_dir / "medicines_master.csv")
    
    return consumption_df, inventory_df, medicines_df


@st.cache_resource
def get_engine():
    """Get prediction engine"""
    consumption_df, inventory_df, medicines_df = load_data()
    return MedPredictEngine(consumption_df, inventory_df, medicines_df)


def render_health_gauge(score: int):
    """Render health score gauge"""
    if score >= 80:
        color = "#10B981"
        status = "Excellent"
    elif score >= 60:
        color = "#3B82F6"
        status = "Good"
    elif score >= 40:
        color = "#F59E0B"
        status = "Needs Attention"
    else:
        color = "#DC2626"
        status = "Critical"
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=score,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': f"Inventory Health<br><span style='font-size:0.8em;color:{color}'>{status}</span>"},
        gauge={
            'axis': {'range': [0, 100], 'tickwidth': 1},
            'bar': {'color': color},
            'steps': [
                {'range': [0, 40], 'color': "#FEE2E2"},
                {'range': [40, 60], 'color': "#FEF3C7"},
                {'range': [60, 80], 'color': "#DBEAFE"},
                {'range': [80, 100], 'color': "#D1FAE5"}
            ],
            'threshold': {
                'line': {'color': "black", 'width': 4},
                'thickness': 0.75,
                'value': score
            }
        }
    ))
    fig.update_layout(height=250, margin=dict(l=20, r=20, t=50, b=20))
    return fig


def render_risk_distribution(expiry_risks):
    """Render risk distribution pie chart"""
    risk_counts = {
        'CRITICAL': len([r for r in expiry_risks if r.risk_level == 'CRITICAL']),
        'HIGH': len([r for r in expiry_risks if r.risk_level == 'HIGH']),
        'MEDIUM': len([r for r in expiry_risks if r.risk_level == 'MEDIUM']),
        'LOW': len([r for r in expiry_risks if r.risk_level == 'LOW'])
    }
    
    colors = ['#DC2626', '#F59E0B', '#3B82F6', '#10B981']
    
    fig = px.pie(
        values=list(risk_counts.values()),
        names=list(risk_counts.keys()),
        color_discrete_sequence=colors,
        hole=0.4
    )
    fig.update_layout(
        title="Expiry Risk Distribution",
        height=300,
        margin=dict(l=20, r=20, t=50, b=20)
    )
    return fig


def render_stockout_timeline(stockout_risks):
    """Render stockout timeline chart"""
    if not stockout_risks:
        return None
    
    # Get top 10 most urgent
    top_risks = stockout_risks[:10]
    
    df = pd.DataFrame([{
        'Medicine': r.medicine_name[:20] + '...' if len(r.medicine_name) > 20 else r.medicine_name,
        'Days Until Stockout': r.days_until_stockout,
        'Risk Level': r.risk_level
    } for r in top_risks])
    
    colors = {'CRITICAL': '#DC2626', 'HIGH': '#F59E0B', 'MEDIUM': '#3B82F6', 'LOW': '#10B981'}
    df['Color'] = df['Risk Level'].map(colors)
    
    fig = px.bar(
        df,
        x='Days Until Stockout',
        y='Medicine',
        orientation='h',
        color='Risk Level',
        color_discrete_map=colors
    )
    fig.update_layout(
        title="Days Until Stockout (Top 10 Urgent)",
        height=400,
        margin=dict(l=20, r=20, t=50, b=20),
        yaxis={'categoryorder': 'total ascending'}
    )
    return fig


def render_expiry_calendar(expiry_risks):
    """Render expiry calendar heatmap"""
    # Group by expiry month
    expiry_data = []
    for r in expiry_risks:
        if r.days_to_expiry > 0:
            expiry_data.append({
                'Month': r.expiry_date.strftime('%Y-%m'),
                'Value': r.potential_loss,
                'Count': 1
            })
    
    if not expiry_data:
        return None
    
    df = pd.DataFrame(expiry_data)
    monthly = df.groupby('Month').agg({'Value': 'sum', 'Count': 'sum'}).reset_index()
    
    fig = px.bar(
        monthly,
        x='Month',
        y='Value',
        text='Count',
        labels={'Value': 'At-Risk Value (₹)', 'Month': 'Expiry Month'}
    )
    fig.update_traces(texttemplate='%{text} batches', textposition='outside')
    fig.update_layout(
        title="Expiry Risk by Month (₹ Value at Risk)",
        height=300,
        margin=dict(l=20, r=20, t=50, b=20)
    )
    return fig


def main():
    """Main dashboard"""
    
    # Header
    st.markdown('<p class="main-header">💊 MedPredict AI</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">AI-Powered Medical Supply Prediction & Expiry Management</p>', unsafe_allow_html=True)
    
    # Load engine
    try:
        engine = get_engine()
    except Exception as e:
        st.error(f"Error loading data: {e}")
        st.info("Please ensure data files are in the /data directory")
        return
    
    # Get predictions
    summary = engine.get_dashboard_summary()
    expiry_risks = engine.calculate_expiry_risks()
    stockout_risks = engine.calculate_stockout_risks()
    
    # Sidebar
    with st.sidebar:
        st.image("https://img.icons8.com/color/96/000000/pills.png", width=80)
        st.markdown("### 🏥 PHC Kodigehalli")
        st.markdown(f"**Date:** {datetime.now().strftime('%B %d, %Y')}")
        st.markdown("---")
        
        st.markdown("### Quick Filters")
        risk_filter = st.selectbox(
            "Risk Level",
            ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"]
        )
        
        category_filter = st.multiselect(
            "Category",
            options=engine.inventory_df['category'].unique().tolist(),
            default=[]
        )
        
        st.markdown("---")
        st.markdown("### 📊 Data Info")
        st.markdown(f"- **Medicines:** {summary['total_medicines']}")
        st.markdown(f"- **Batches:** {summary['total_batches']}")
        st.markdown(f"- **Last Updated:** Now")
        
        if st.button("🔄 Refresh Data"):
            st.cache_data.clear()
            st.cache_resource.clear()
            st.rerun()
    
    # Main content
    # Row 1: Key Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            "💰 Inventory Value",
            f"₹{summary['total_inventory_value']:,.0f}",
            help="Total value of current inventory"
        )
    
    with col2:
        st.metric(
            "⚠️ At-Risk Value",
            f"₹{summary['expiry_risk']['total_at_risk_value']:,.0f}",
            delta=f"-{summary['expiry_risk']['total_at_risk_value']/summary['total_inventory_value']*100:.1f}%" if summary['total_inventory_value'] > 0 else "0%",
            delta_color="inverse",
            help="Value of inventory at risk of expiry"
        )
    
    with col3:
        critical_total = summary['expiry_risk']['critical_count'] + summary['stockout_risk']['critical_count']
        st.metric(
            "🚨 Critical Alerts",
            critical_total,
            delta="Needs attention" if critical_total > 0 else "All clear",
            delta_color="inverse" if critical_total > 0 else "normal",
            help="Items needing immediate action"
        )
    
    with col4:
        st.metric(
            "📦 Low Stock Items",
            summary['stockout_risk']['critical_count'] + summary['stockout_risk']['high_count'],
            help="Items at risk of stockout"
        )
    
    st.markdown("---")
    
    # Row 2: Health Score and Charts
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        st.plotly_chart(render_health_gauge(summary['health_score']), use_container_width=True)
    
    with col2:
        st.plotly_chart(render_risk_distribution(expiry_risks), use_container_width=True)
    
    with col3:
        expiry_cal = render_expiry_calendar(expiry_risks)
        if expiry_cal:
            st.plotly_chart(expiry_cal, use_container_width=True)
    
    st.markdown("---")
    
    # Row 3: Alerts
    st.markdown("### 🚨 Active Alerts")
    
    tab1, tab2 = st.tabs(["📅 Expiry Alerts", "📦 Stockout Alerts"])
    
    with tab1:
        # Filter risks
        filtered_expiry = expiry_risks
        if risk_filter != "All":
            filtered_expiry = [r for r in filtered_expiry if r.risk_level == risk_filter]
        
        if not filtered_expiry:
            st.success("✅ No expiry alerts matching your filters!")
        else:
            for risk in filtered_expiry[:10]:
                css_class = f"risk-{risk.risk_level.lower()}"
                
                with st.container():
                    col1, col2, col3 = st.columns([3, 1, 2])
                    
                    with col1:
                        st.markdown(f"""
                        <div class="{css_class}">
                            <strong>{risk.risk_level}</strong> | {risk.medicine_name}<br>
                            <small>Batch: {risk.batch_no} | Qty: {risk.current_quantity} | Expires: {risk.expiry_date.strftime('%Y-%m-%d')}</small>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with col2:
                        st.metric("Days Left", risk.days_to_expiry)
                    
                    with col3:
                        st.markdown(f"**At Risk:** {risk.quantity_at_risk} units (₹{risk.potential_loss:,.0f})")
                        st.caption(risk.recommendation)
    
    with tab2:
        # Filter risks
        filtered_stockout = stockout_risks
        if risk_filter != "All":
            filtered_stockout = [r for r in filtered_stockout if r.risk_level == risk_filter]
        
        if not filtered_stockout:
            st.success("✅ No stockout alerts matching your filters!")
        else:
            for risk in filtered_stockout[:10]:
                css_class = f"risk-{risk.risk_level.lower()}"
                
                with st.container():
                    col1, col2, col3 = st.columns([3, 1, 2])
                    
                    with col1:
                        st.markdown(f"""
                        <div class="{css_class}">
                            <strong>{risk.risk_level}</strong> | {risk.medicine_name}<br>
                            <small>Current Stock: {risk.current_stock} | Avg Daily: {risk.avg_daily_consumption}</small>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with col2:
                        st.metric("Days Left", f"{risk.days_until_stockout:.0f}")
                    
                    with col3:
                        st.markdown(f"**Order:** {risk.recommended_order} units")
                        st.caption(risk.recommendation)
    
    st.markdown("---")
    
    # Row 4: Stockout Timeline
    st.markdown("### 📊 Stockout Risk Timeline")
    stockout_chart = render_stockout_timeline(stockout_risks)
    if stockout_chart:
        st.plotly_chart(stockout_chart, use_container_width=True)
    
    st.markdown("---")
    
    # Row 5: Detailed Tables
    st.markdown("### 📋 Detailed Analysis")
    
    tab1, tab2, tab3 = st.tabs(["Expiry Risk Details", "Stockout Risk Details", "Full Inventory"])
    
    with tab1:
        expiry_df = pd.DataFrame([{
            'Medicine': r.medicine_name,
            'Batch': r.batch_no,
            'Quantity': r.current_quantity,
            'Expiry Date': r.expiry_date.strftime('%Y-%m-%d'),
            'Days Left': r.days_to_expiry,
            'At Risk Qty': r.quantity_at_risk,
            'Risk Score': r.risk_score,
            'Risk Level': r.risk_level,
            'Potential Loss (₹)': f"{r.potential_loss:,.0f}"
        } for r in expiry_risks])
        
        st.dataframe(
            expiry_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Risk Score": st.column_config.ProgressColumn(
                    "Risk Score",
                    min_value=0,
                    max_value=100,
                    format="%.1f"
                )
            }
        )
    
    with tab2:
        stockout_df = pd.DataFrame([{
            'Medicine': r.medicine_name,
            'Current Stock': r.current_stock,
            'Avg Daily Usage': r.avg_daily_consumption,
            'Weekly Usage': r.predicted_weekly_consumption,
            'Days Until Stockout': f"{r.days_until_stockout:.1f}",
            'Risk Level': r.risk_level,
            'Recommended Order': r.recommended_order
        } for r in stockout_risks])
        
        st.dataframe(stockout_df, use_container_width=True, hide_index=True)
    
    with tab3:
        inventory_df = engine.inventory_df.copy()
        inventory_df['expiry_date'] = pd.to_datetime(inventory_df['expiry_date']).dt.strftime('%Y-%m-%d')
        st.dataframe(inventory_df, use_container_width=True, hide_index=True)
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: #6B7280; padding: 1rem;'>
            <p>🏥 MedPredict AI | Reducing medicine waste, ensuring patient care</p>
            <p><small>Built for AI Hackathon 2026 | Version 1.0</small></p>
        </div>
        """,
        unsafe_allow_html=True
    )


if __name__ == "__main__":
    main()

