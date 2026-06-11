import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # Set to Widescreen (16:9)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Colors
    c_orange = RGBColor(37, 99, 235)       # Brand Blue (was Orange)
    c_dark = RGBColor(30, 41, 59)          # Slate 800 (Dark text)
    c_gray = RGBColor(100, 116, 139)       # Slate 500 (Muted text)
    c_white = RGBColor(255, 255, 255)
    c_bg_orange = RGBColor(239, 246, 255)   # Blue 50 (Card BG)
    c_border_orange = RGBColor(147, 197, 253) # Blue 300 (Border)
    c_bg_gray = RGBColor(248, 250, 252)     # Slate 50 (Card BG Gray)
    c_border_gray = RGBColor(226, 232, 240)   # Slate 200 (Border Gray)

    # Fonts
    font_main = "Arial" # Standard cross-platform font that looks clean

    # Helper to create slide with white background and standard slide title
    def add_slide(title_text=""):
        slide = prs.slides.add_slide(prs.slide_layouts[6]) # blank layout
        
        # Add background color (light grey/white)
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = RGBColor(250, 250, 250)
        bg.line.fill.background()
        
        if title_text:
            # Header Title
            title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(0.8))
            tf = title_box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = title_text
            p.font.name = font_main
            p.font.size = Pt(32)
            p.font.bold = True
            p.font.color.rgb = c_dark
            
            # Orange small indicator bar under title
            bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.3), Inches(1.5), Inches(0.06))
            bar.fill.solid()
            bar.fill.fore_color.rgb = c_orange
            bar.line.fill.background()
            
        return slide

    # Helper to add a stylized text card
    def add_card(slide, left, top, width, height, title="", body_lines=[], is_orange=False):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = c_bg_orange if is_orange else c_bg_gray
        card.line.color.rgb = c_border_orange if is_orange else c_border_gray
        card.line.width = Pt(1.5)
        
        # Add text box inside card
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        # Card title
        first = True
        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = font_main
            p.font.size = Pt(18)
            p.font.bold = True
            p.font.color.rgb = c_orange if not is_orange else c_dark
            first = False
            
        for line in body_lines:
            p = tf.add_paragraph() if not first else tf.paragraphs[0]
            first = False
            p.text = line
            p.font.name = font_main
            p.font.size = Pt(14)
            p.font.color.rgb = c_dark
            p.space_after = Pt(6)
            
        return card

    # ==========================================
    # SLIDE 1: Title Slide (Cover)
    # ==========================================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(255, 255, 255)
    bg1.line.fill.background()
    
    # Large Orange Accent Box on the Left
    left_accent = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.4), prs.slide_height)
    left_accent.fill.solid()
    left_accent.fill.fore_color.rgb = c_orange
    left_accent.line.fill.background()
    
    # Title Text Box
    tb_title = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.0), Inches(2.2))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    
    # Main Title
    p_main = tf_title.paragraphs[0]
    p_main.text = "WARUNGBUDGET AI (v2.0)"
    p_main.font.name = font_main
    p_main.font.size = Pt(54)
    p_main.font.bold = True
    p_main.font.color.rgb = c_orange
    p_main.space_after = Pt(8)
    
    # Subtitle
    p_sub = tf_title.add_paragraph()
    p_sub.text = "Solving Real Problems with AI Collaboration"
    p_sub.font.name = font_main
    p_sub.font.size = Pt(24)
    p_sub.font.bold = True
    p_sub.font.color.rgb = c_dark
    p_sub.space_after = Pt(8)

    p_desc = tf_title.add_paragraph()
    p_desc.text = "Aplikasi Rekomendasi Makanan Ekonomis Mahasiswa Kos Tembalang Berbasis Peta Lokasi & Database Dinamis"
    p_desc.font.name = font_main
    p_desc.font.size = Pt(16)
    p_desc.font.color.rgb = c_gray
    
    # Group Info
    tb_info = slide1.shapes.add_textbox(Inches(1.0), Inches(4.5), Inches(10.0), Inches(2.0))
    tf_info = tb_info.text_frame
    tf_info.word_wrap = True
    
    p_group = tf_info.paragraphs[0]
    p_group.text = "TUGAS BESAR - KELOMPOK AI FOR REAL IMPACT"
    p_group.font.name = font_main
    p_group.font.size = Pt(14)
    p_group.font.bold = True
    p_group.font.color.rgb = c_dark
    p_group.space_after = Pt(4)
    
    p_members = tf_info.add_paragraph()
    p_members.text = "Anggota Kelompok:\n[Nama Anda] (NIM) | [Nama Anggota] (NIM) | [Nama Anggota] (NIM)"
    p_members.font.name = font_main
    p_members.font.size = Pt(13)
    p_members.font.color.rgb = c_gray

    # ==========================================
    # SLIDE 2: Latar Belakang Masalah
    # ==========================================
    slide2 = add_slide("Latar Belakang & Urgensi Masalah")
    
    # Card 1 (Left): Permasalahan Nyata
    add_card(
        slide2,
        left=Inches(0.8),
        top=Inches(1.8),
        width=Inches(5.5),
        height=Inches(4.8),
        title="Masalah Riil Mahasiswa Kos",
        body_lines=[
            "• Keterbatasan Budget Bulanan: Mahasiswa kos di kawasan Tembalang sering kesulitan membagi uang saku harian untuk konsumsi makan.",
            "",
            "• Pola Makan Tidak Sehat: Untuk menghemat uang, mahasiswa beralih ke mie instan atau makanan cepat saji murah yang minim nutrisi.",
            "",
            "• Kurangnya Informasi Lokasi: Banyak warung makan murah yang tersebar di gang-gang kecil Tembalang namun tidak terpetakan dengan jelas."
        ],
        is_orange=True
    )
    
    # Card 2 (Right): Dampak & Urgensi
    add_card(
        slide2,
        left=Inches(6.8),
        top=Inches(1.8),
        width=Inches(5.7),
        height=Inches(4.8),
        title="Dampak & Mengapa Penting Diselesaikan",
        body_lines=[
            "• Penurunan Imun dan Konsentrasi: Pola konsumsi yang buruk berdampak langsung pada performa akademis dan kesehatan fisik.",
            "",
            "• Pengelolaan Keuangan yang Buruk: Tanpa asisten pengingat/kalkulator budget harian, uang saku habis sebelum akhir bulan.",
            "",
            "• Target Pengguna Spesifik: Mahasiswa rantau (kos) di area Tembalang yang membutuhkan panduan praktis kuliner hemat & sehat."
        ]
    )

    # ==========================================
    # SLIDE 3: Ide Solusi
    # ==========================================
    slide3 = add_slide("Ide Solusi: WarungBudget AI v2")
    
    # Subtitle or hook text
    sub_box = slide3.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(0.5))
    sub_box.text_frame.text = "Transformasi dari web statis v1 menjadi asisten budgeting dinamis yang interaktif."
    sub_box.text_frame.paragraphs[0].font.size = Pt(16)
    sub_box.text_frame.paragraphs[0].font.color.rgb = c_gray
    sub_box.text_frame.paragraphs[0].font.name = font_main
    
    # 3 Cards Layout
    add_card(
        slide3,
        left=Inches(0.8),
        top=Inches(2.1),
        width=Inches(3.7),
        height=Inches(4.5),
        title="Kalkulator Budget Pintar",
        body_lines=[
            "Membagi sisa anggaran Anda menjadi jatah sekali makan atau harian secara instan agar tidak mengalami defisit keuangan di akhir bulan."
        ]
    )
    
    add_card(
        slide3,
        left=Inches(4.8),
        top=Inches(2.1),
        width=Inches(3.7),
        height=Inches(4.5),
        title="Peta Interaktif Leaflet",
        body_lines=[
            "Menavigasi warung-warung makan murah terdekat secara visual di peta Tembalang, lengkap dengan harga menu dan kecocokan budget harian."
        ],
        is_orange=True
    )
    
    add_card(
        slide3,
        left=Inches(8.8),
        top=Inches(2.1),
        width=Inches(3.7),
        height=Inches(4.5),
        title="Resep Masak Kos Sehat",
        body_lines=[
            "Menyediakan resep alternatif berbiaya rendah dengan filter kandungan gizi tinggi protein/serat untuk dimasak sendiri di kamar kos."
        ]
    )

    # ==========================================
    # SLIDE 4: Fitur Utama Aplikasi
    # ==========================================
    slide4 = add_slide("Fitur Utama Aplikasi")
    
    # 2x2 Grid for features
    add_card(
        slide4,
        left=Inches(0.8),
        top=Inches(1.8),
        width=Inches(5.6),
        height=Inches(2.3),
        title="1. Pengolah Anggaran Fleksibel",
        body_lines=[
            "• Pengguna memasukkan total budget yang dimiliki.",
            "• Memilih opsi durasi: Sekali Makan, Harian, atau Bulanan."
        ]
    )
    
    add_card(
        slide4,
        left=Inches(6.8),
        top=Inches(1.8),
        width=Inches(5.7),
        height=Inches(2.3),
        title="2. Peta Lokasi & Navigasi",
        body_lines=[
            "• Peta Leaflet interaktif yang menandai titik warung makan.",
            "• Popup peta menampilkan nama warung, menu, dan koordinat."
        ],
        is_orange=True
    )
    
    add_card(
        slide4,
        left=Inches(0.8),
        top=Inches(4.4),
        width=Inches(5.6),
        height=Inches(2.3),
        title="3. Filter Pintar & Detail Langkah",
        body_lines=[
            "• Filter gizi (Tinggi Protein, Banyak Sayur, Semurah Mungkin).",
            "• Modal instruksi resep (Alat, bahan, dan cara memasak)."
        ],
        is_orange=True
    )
    
    add_card(
        slide4,
        left=Inches(6.8),
        top=Inches(4.4),
        width=Inches(5.7),
        height=Inches(2.3),
        title="4. CRUD Admin Panel",
        body_lines=[
            "• Admin dapat mengelola data makanan secara real-time.",
            "• Aksi: Tambah warung, edit menu, dan hapus resep kos."
        ]
    )

    # ==========================================
    # SLIDE 5: Arsitektur & Teknologi Stack
    # ==========================================
    slide5 = add_slide("Arsitektur & Teknologi Stack")
    
    # Card Left: Frontend & UI
    add_card(
        slide5,
        left=Inches(0.8),
        top=Inches(1.8),
        width=Inches(5.5),
        height=Inches(4.8),
        title="UI/UX & Frontend Framework",
        body_lines=[
            "• React & TypeScript: Menghasilkan kode UI yang terstruktur dan aman.",
            "",
            "• Tailwind CSS: Menerapkan gaya modern Glassmorphism transparan yang responsif di ponsel/desktop.",
            "",
            "• Leaflet Maps: Menampilkan peta peta dinamis tanpa dependensi Google Maps API yang berbayar."
        ]
    )
    
    # Card Right: Backend & Server
    add_card(
        slide5,
        left=Inches(6.8),
        top=Inches(1.8),
        width=Inches(5.7),
        height=Inches(4.8),
        title="Backend & Serverless Server",
        body_lines=[
            "• TanStack Start: Meta-framework full-stack modern dengan File-based Routing dan Server Functions.",
            "",
            "• Database JSON Lokal (db.json): Solusi penyimpanan data ringkas di tingkat server untuk mempercepat load time.",
            "",
            "• Vercel Hosting: Deploy otomatis ke serverless cloud Vercel menggunakan Nitro preset Vercel."
        ],
        is_orange=True
    )

    # ==========================================
    # SLIDE 6: Pemanfaatan Collaborative AI
    # ==========================================
    slide6 = add_slide("Pemanfaatan Collaborative AI")
    
    # Table like layout with shapes
    headers = ["Aktivitas Pengembangan", "Tools AI yang Digunakan", "Peran dan Output AI"]
    row_data = [
        ["Brainstorming Ide & Data", "Gemini / ChatGPT", "Merancang skema database makanan lokal (db.json)"],
        ["Desain & Layout UI", "Tailwind v4 / Lovable", "Menyusun estetika glassmorphism dan toggle dark mode"],
        ["Pengembangan Kode (Coding)", "Antigravity AI / Cursor", "Membuat rute file-based /v2 dan Server Functions CRUD"],
        ["Penyelesaian Bug (Debugging)", "Claude / Antigravity AI", "Memperbaiki error SSR Leaflet & setelan preset Nitro Vercel"]
    ]
    
    # Draw Headers
    h_width = [Inches(3.2), Inches(3.0), Inches(5.5)]
    h_left = [Inches(0.8), Inches(4.0), Inches(7.0)]
    
    for i in range(3):
        box = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, h_left[i], Inches(1.8), h_width[i], Inches(0.6))
        box.fill.solid()
        box.fill.fore_color.rgb = c_orange
        box.line.fill.background()
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = headers[i]
        p.font.name = font_main
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = c_white
        p.alignment = PP_ALIGN.CENTER
        
    # Draw Rows
    for row_idx, row in enumerate(row_data):
        top_pos = Inches(2.5) + (row_idx * Inches(1.0))
        for col_idx, text in enumerate(row):
            box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, h_left[col_idx], top_pos, h_width[col_idx], Inches(0.8))
            box.fill.solid()
            box.fill.fore_color.rgb = c_bg_gray
            box.line.color.rgb = c_border_gray
            tf = box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = text
            p.font.name = font_main
            p.font.size = Pt(13)
            p.font.color.rgb = c_dark
            p.alignment = PP_ALIGN.CENTER if col_idx < 2 else PP_ALIGN.LEFT

    # ==========================================
    # SLIDE 7: Validasi, Revisi, dan Refleksi
    # ==========================================
    slide7 = add_slide("Validasi, Revisi, dan Refleksi")
    
    # Card Left: Debugging
    add_card(
        slide7,
        left=Inches(0.8),
        top=Inches(1.8),
        width=Inches(5.5),
        height=Inches(4.8),
        title="Validasi & Koreksi Output AI",
        body_lines=[
            "• Masalah SSR Leaflet (Error Window is Not Defined): AI meng-generate inisialisasi peta secara naif di root komponen. Kami memperbaikinya secara manual menggunakan lazy dynamic import di dalam useEffect agar inisialisasi hanya berjalan di browser.",
            "",
            "• Masalah 404 Vercel: Vercel mendeteksi aplikasi sebagai static Vite. Kami merevisi file konfigurasi vite.config.ts untuk secara aktif memaksa preset Vercel pada bundling Nitro server."
        ],
        is_orange=True
    )
    
    # Card Right: Reflection
    add_card(
        slide7,
        left=Inches(6.8),
        top=Inches(1.8),
        width=Inches(5.7),
        height=Inches(4.8),
        title="Refleksi Kolaborasi dengan AI",
        body_lines=[
            "• Efisiensi Kerja: AI berperan penting sebagai partner akselerasi ide dan penyedia template awal layout UI secara cepat.",
            "",
            "• Berpikir Kritis Manusia Tetap Utama: AI memiliki keterbatasan dalam memahami konteks runtime yang berbeda (SSR vs Client). Keahlian manusia diperlukan untuk memvalidasi, men-debug, dan memastikan integritas arsitektur kode.",
            "",
            "• 'Don't start with AI. Start with a real problem worth solving.' - Kami berkolaborasi secara bijak dengan menaruh empati pada krisis finansial anak kos terlebih dahulu."
        ]
    )

    # Save presentation
    prs.save("drafts/presentasi_tugas_besar.pptx")
    print("Presentation created successfully at drafts/presentasi_tugas_besar.pptx")

if __name__ == "__main__":
    create_presentation()
