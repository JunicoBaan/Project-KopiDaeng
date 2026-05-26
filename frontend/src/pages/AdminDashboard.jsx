import { useState, useEffect, useRef, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/produk');
      return;
    }
    fetchDashboard();
  }, [user, navigate]);

  const fetchDashboard = async (startFilter = '', endFilter = '') => {
    try {
      const response = await api.get(`/dashboard?start=${startFilter}&end=${endFilter}`);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchDashboard(start, end);
  };

  const handleReset = () => {
    setStart('');
    setEnd('');
    fetchDashboard('', '');
  };

  const handleExportExcel = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/dashboard/export?start=${start}&end=${end}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan_penjualan_${start || 'semua'}_ke_${end || 'semua'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Gagal mendownload laporan Excel.');
    }
  };

  // Render Chart
  useEffect(() => {
    if (!loading && data?.laporan && window.Chart) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const labels = data.laporan.map(row => new Date(row.tanggal).toLocaleDateString('id-ID'));
      const dataTotal = data.laporan.map(row => row.total_penjualan);
      const dataJumlah = data.laporan.map(row => row.jumlah_pesanan);

      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Penjualan (Rp)',
              data: dataTotal,
              backgroundColor: 'rgba(230,126,34,0.6)',
              borderColor: '#d35400',
              borderWidth: 2
            },
            {
              label: 'Jumlah Pesanan',
              data: dataJumlah,
              type: 'line',
              borderColor: '#2c3e50',
              borderWidth: 2,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Grafik Penjualan Harian',
              font: { size: 18, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rp ' + value.toLocaleString('id-ID');
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [loading, data]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: '#fcfaf7', display: 'flex' }}>
      <div className="main-container dashboard-page-wrapper" style={{ 
        display: 'flex', 
        margin: 0, 
        padding: 0, 
        width: '100%', 
        maxWidth: 'none',
        minHeight: '100vh', 
        background: '#fcfaf7', 
        boxShadow: 'none', 
        border: 'none', 
        borderRadius: 0,
        overflow: 'visible',
        marginTop: '-75px' // offset body padding-top 75px
      }}>
        
        <SidebarAdmin active="dashboard" />

        <main className="dashboard-main-content" style={{ 
          flex: 1, 
          marginLeft: '260px', 
          padding: '40px', 
          background: '#fcfaf7', 
          minHeight: '100vh', 
          boxSizing: 'border-box' 
        }}>
          
          {/* HEADER SECTION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #efebe9', paddingBottom: '20px', marginBottom: '35px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, color: '#4a2c2a', letterSpacing: '-0.5px' }}>
                Hai Admin, {user ? user.nama : "Admin"}!
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#795548', fontSize: '1rem', fontWeight: 400 }}>
                Berikut adalah ringkasan performa penjualan dan aktivitas toko KopiDaeng Anda hari ini.
              </p>
            </div>
          </div>

          {/* GRID KARTU STATISTIK (ACCENTED MINIMALIST LAYOUT - NO EMOJIS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            {/* CARD 1: TOTAL PRODUK */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #efebe9', 
              borderLeft: '4px solid #e67e22',
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#8d6e63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Produk</h3>
              <p style={{ margin: '8px 0 4px 0', fontSize: '2.2rem', fontWeight: 800, color: '#4a2c2a', lineHeight: 1 }}>{data?.data?.totalProduk || 0}</p>
              <span style={{ fontSize: '0.78rem', color: '#a1887f' }}>Menu kopi terdaftar</span>
            </div>

            {/* CARD 2: TOTAL STOK */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #efebe9', 
              borderLeft: '4px solid #d4a373',
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#8d6e63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Stok</h3>
              <p style={{ margin: '8px 0 4px 0', fontSize: '2.2rem', fontWeight: 800, color: '#4a2c2a', lineHeight: 1 }}>{data?.data?.totalStok || 0}</p>
              <span style={{ fontSize: '0.78rem', color: '#a1887f' }}>Jumlah porsi cup tersedia</span>
            </div>

            {/* CARD 3: TOTAL PENGGUNA */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #efebe9', 
              borderLeft: '4px solid #8d6e63',
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#8d6e63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pengguna</h3>
              <p style={{ margin: '8px 0 4px 0', fontSize: '2.2rem', fontWeight: 800, color: '#4a2c2a', lineHeight: 1 }}>{data?.data?.totalUser || 0}</p>
              <span style={{ fontSize: '0.78rem', color: '#a1887f' }}>Pelanggan terdaftar</span>
            </div>

            {/* CARD 4: TOTAL PESANAN */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #efebe9', 
              borderLeft: '4px solid #d35400',
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#8d6e63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pesanan</h3>
              <p style={{ margin: '8px 0 4px 0', fontSize: '2.2rem', fontWeight: 800, color: '#4a2c2a', lineHeight: 1 }}>{data?.data?.totalPesanan || 0}</p>
              <span style={{ fontSize: '0.78rem', color: '#a1887f' }}>Transaksi diproses</span>
            </div>

          </div>

          {/* SECTION: LAPORAN PENJUALAN HARIAN */}
          <section style={{ marginTop: '40px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
              <h2 style={{ color: '#4a2c2a', margin: 0, fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                Performa & Laporan Penjualan
              </h2>
              
              {/* TOMBOL DOWNLOAD EXCEL MEWAH */}
              <button 
                type="button" 
                onClick={handleExportExcel} 
                className="btn" 
                style={{ 
                  width: 'auto', 
                  padding: '10px 24px', 
                  borderRadius: '30px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  boxShadow: '0 4px 15px rgba(230,126,34,0.25)', 
                  cursor: 'pointer' 
                }}
              >
                Ekspor Laporan Excel
              </button>
            </div>

            {/* BOX FILTER PREMIUM */}
            <div style={{ background: '#ffffff', border: '1px solid #efebe9', borderRadius: '16px', padding: '24px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <form onSubmit={handleFilter} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '20px' }}>
                
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8d6e63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dari Tanggal</label>
                  <input 
                    type="date" 
                    value={start} 
                    onChange={e => setStart(e.target.value)} 
                    required 
                    style={{ 
                      width: '100%', 
                      height: '44px',
                      padding: '0 16px', 
                      borderRadius: '8px', 
                      border: '1px solid #d7ccc8', 
                      outline: 'none', 
                      background: '#fffcf9', 
                      fontSize: '0.95rem', 
                      fontFamily: 'inherit', 
                      boxSizing: 'border-box',
                      transition: 'all 0.3s' 
                    }}
                  />
                </div>

                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8d6e63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sampai Tanggal</label>
                  <input 
                    type="date" 
                    value={end} 
                    onChange={e => setEnd(e.target.value)} 
                    required 
                    style={{ 
                      width: '100%', 
                      height: '44px',
                      padding: '0 16px', 
                      borderRadius: '8px', 
                      border: '1px solid #d7ccc8', 
                      outline: 'none', 
                      background: '#fffcf9', 
                      fontSize: '0.95rem', 
                      fontFamily: 'inherit', 
                      boxSizing: 'border-box',
                      transition: 'all 0.3s' 
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button 
                    type="submit" 
                    className="btn" 
                    style={{ 
                      width: 'auto', 
                      height: '44px', 
                      padding: '0 28px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center' 
                    }}
                  >
                    Filter Data
                  </button>
                  <button 
                    type="button" 
                    onClick={handleReset} 
                    className="btn-small btn-delete" 
                    style={{ 
                      height: '44px', 
                      padding: '0 24px', 
                      borderRadius: '8px', 
                      background: '#5d4037', 
                      color: 'white', 
                      border: 'none', 
                      fontWeight: 600, 
                      cursor: 'pointer', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    Reset
                  </button>
                </div>

              </form>
            </div>

            {/* CHART PENJUALAN */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 25px rgba(0,0,0,0.03)', border: '1px solid #efebe9', marginBottom: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#5d4037', fontSize: '1.05rem', fontWeight: 700 }}>Grafik Penjualan Harian</h4>
                <span style={{ fontSize: '0.85rem', color: '#8d6e63' }}>Menunjukkan tren omzet penjualan & volume pesanan</span>
              </div>
              <canvas ref={canvasRef} height="100"></canvas>
            </div>

            {/* TABEL LAPORAN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#5d4037', fontSize: '1.05rem', fontWeight: 700 }}>Rincian Data Harian</h4>
                <span style={{ fontSize: '0.85rem', color: '#8d6e63' }}>Data pesanan sukses & lunas</span>
              </div>

              {data?.laporan && data.laporan.length > 0 ? (
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e0dccc', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', background: '#fff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead>
                      <tr style={{ background: '#f8f4e9', borderBottom: '2px solid #e0dccc' }}>
                        <th style={{ padding: '16px 20px', fontWeight: 600, color: '#4a2c2a' }}>Tanggal Penjualan</th>
                        <th style={{ padding: '16px 20px', fontWeight: 600, color: '#4a2c2a', textAlign: 'center' }}>Jumlah Pesanan</th>
                        <th style={{ padding: '16px 20px', fontWeight: 600, color: '#4a2c2a', textAlign: 'right' }}>Total Penjualan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.laporan.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #efebe9', transition: 'background-color 0.2s', background: idx % 2 === 0 ? '#fff' : '#fdfbf9' }}>
                          <td style={{ padding: '16px 20px', fontWeight: 500, color: '#3d2b1f' }}>
                            {new Date(row.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <span style={{ background: '#fff8e1', color: '#ff8f00', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #ffe082' }}>
                              {row.jumlah_pesanan} Pesanan
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#2e7d32' }}>
                            Rp {row.total_penjualan.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e0dccc', textAlign: 'center', color: '#8d6e63' }}>
                  Tidak ada data penjualan dalam rentang tanggal ini.
                </div>
              )}
            </div>

          </section>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
