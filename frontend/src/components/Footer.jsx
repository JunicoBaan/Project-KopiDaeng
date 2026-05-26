import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer-container">
        {/* KIRI */}
        <div className="footer-left">
          <h3 className="footer-title">KopiDaeng</h3>

          <p><i className="fa-solid fa-location-dot"></i> Center Point of Indonesia, Makassar</p>
          <p><i className="fa-solid fa-clock"></i> 08.00 - 22.00</p>
          <p><i className="fa-brands fa-whatsapp"></i> 0823-9305-8060</p>
          <p><i className="fa-solid fa-envelope"></i> kopidaeng@gmail.com</p>

          <div className="footer-map">
            <iframe
              title="Google Maps Location"
              width="100%"
              height="160"
              style={{ border: 0, pointerEvents: 'auto', borderRadius: '10px', marginTop: '10px' }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?&q=Center+Point+of+Indonesia+Makassar&output=embed"
            ></iframe>
          </div>
        </div>

        {/* KANAN */}
        <div className="footer-right">
          <h3 className="footer-title">Tentang Developer</h3>

          <p className="about-text">
            Halo! Saya Junico Baan, Mahasiswa Teknik Informatika.<br />
            Developer website KopiDaeng dengan fokus pada tampilan yang simpel, clean, dan fungsional.
            Terima kasih sudah menggunakan aplikasi ini
          </p>

          <div className="footer-sosmed">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="sosmed-icon ig">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="sosmed-icon fb">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://wa.me/6282393058060" target="_blank" rel="noopener noreferrer" className="sosmed-icon wa">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/6282393058060" className="wa-float" target="_blank" rel="noopener noreferrer">
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-container {
          margin-top: 40px;
          background: #3a2518;
          padding: 40px 30px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 40px;
          border-top: 4px;
          color: #fff;
        }

        .footer-title {
          color: #ffb779;
          font-size: 22px;
          margin-bottom: 15px;
        }

        .footer-left,
        .footer-right {
          flex: 1;
          min-width: 300px;
        }

        .footer-left p,
        .footer-right p {
          font-size: 15px;
          margin: 6px 0;
        }

        /* ABOUT teks dibatasi biar tidak kepanjangan */
        .about-text {
          max-width: 450px;
          line-height: 1.55;
          margin-bottom: 15px;
          text-align: justify;
        }

        /* SOSMED ICONS */
        .footer-sosmed {
          display: flex;
          gap: 12px;
        }

        .sosmed-icon {
          font-size: 20px;
          background: #d87a2f;
          color: white;
          padding: 12px;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.2s;
          text-decoration: none;
        }

        .sosmed-icon:hover {
          background: #b76322;
        }

        /* FLOATING WHATSAPP */
        .wa-float {
          position: fixed;
          right: 25px;
          bottom: 25px;
          background: #25D366;
          color: white;
          padding: 14px;
          border-radius: 50%;
          font-size: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          text-decoration: none;
        }
      `}} />
    </>
  );
};

export default Footer;
