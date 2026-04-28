import customtkinter as ctk
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import threading

# Konfigurasi Tema
ctk.set_appearance_mode("Dark")  # Mode gelap
ctk.set_default_color_theme("blue")  # Tema warna biru

class SiagaDesaApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("SiagaDesa - Deteksi Dini Bencana")
        self.geometry("700x550")
        
        # Inisialisasi Model
        self.pipeline_status = None
        self.pipeline_jenis = None
        
        self.setup_ui()
        
        # Load model in background
        threading.Thread(target=self.train_model).start()

    def train_model(self):
        # 1. Dataset Buatan (Dummy Data)
        data = {
            'laporan': [
                "Air sungai mulai naik dan hujan deras dari pagi",
                "Jalanan utama banjir sepinggang, tidak bisa dilewati",
                "Hujan rintik-rintik, kondisi masih aman terkendali",
                "Ada tebing yang longsor menutupi jalan desa",
                "Tanah retak-retak di lereng bukit setelah hujan kemarin",
                "Matahari bersinar terik, cuaca cerah hari ini",
                "Angin puting beliung merusak beberapa atap rumah warga",
                "Pohon tumbang menutup akses jalan karena angin kencang",
                "Kondisi pos ronda aman, warga sedang berkumpul santai",
                "Debit air bendungan meluap ke sawah warga"
            ],
            'status': ['Waspada', 'Bahaya', 'Aman', 'Bahaya', 'Waspada', 'Aman', 'Bahaya', 'Waspada', 'Aman', 'Bahaya'],
            'jenis_bencana': ['Banjir', 'Banjir', 'Tidak Ada', 'Longsor', 'Longsor', 'Tidak Ada', 'Angin Kencang', 'Angin Kencang', 'Tidak Ada', 'Banjir']
        }

        df = pd.DataFrame(data)

        self.pipeline_status = Pipeline([
            ('tfidf', TfidfVectorizer()),
            ('clf', MultinomialNB())
        ])

        self.pipeline_jenis = Pipeline([
            ('tfidf', TfidfVectorizer()),
            ('clf', MultinomialNB())
        ])

        self.pipeline_status.fit(df['laporan'], df['status'])
        self.pipeline_jenis.fit(df['laporan'], df['jenis_bencana'])
        
        self.btn_analyze.configure(state="normal", text="Analisis Laporan")
        
    def setup_ui(self):
        # Header
        self.header_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.header_frame.pack(pady=20, padx=20, fill="x")
        
        self.label_title = ctk.CTkLabel(self.header_frame, text="🛡️ SiagaDesa", font=ctk.CTkFont(size=28, weight="bold"))
        self.label_title.pack()
        
        self.label_subtitle = ctk.CTkLabel(self.header_frame, text="Aplikasi Desktop Analisis Laporan Warga untuk Deteksi Dini Bencana", text_color="gray")
        self.label_subtitle.pack()

        # Input Frame
        self.input_frame = ctk.CTkFrame(self)
        self.input_frame.pack(pady=10, padx=20, fill="both", expand=True)

        self.label_input = ctk.CTkLabel(self.input_frame, text="Kirim Laporan Situasi:", font=ctk.CTkFont(size=14, weight="bold"))
        self.label_input.pack(pady=10, padx=10, anchor="w")

        self.textbox = ctk.CTkTextbox(self.input_frame, height=120)
        self.textbox.pack(pady=0, padx=10, fill="x")
        self.textbox.insert("0.0", "Contoh: Air sungai mulai naik dan hujan deras dari pagi...")

        self.btn_analyze = ctk.CTkButton(self.input_frame, text="Memuat Model AI...", state="disabled", command=self.analyze_report)
        self.btn_analyze.pack(pady=15, padx=10, fill="x")

        # Result Frame
        self.result_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.result_frame.pack(pady=10, padx=20, fill="x")

        # Grid for results
        self.result_frame.grid_columnconfigure(0, weight=1)
        self.result_frame.grid_columnconfigure(1, weight=1)

        # Status Box
        self.box_status = ctk.CTkFrame(self.result_frame)
        self.box_status.grid(row=0, column=0, padx=5, pady=5, sticky="ew")
        
        self.label_status_title = ctk.CTkLabel(self.box_status, text="TINGKAT STATUS", text_color="gray")
        self.label_status_title.pack(pady=(15, 5))
        
        self.label_status_val = ctk.CTkLabel(self.box_status, text="-", font=ctk.CTkFont(size=24, weight="bold"))
        self.label_status_val.pack(pady=(0, 15))

        # Jenis Bencana Box
        self.box_jenis = ctk.CTkFrame(self.result_frame)
        self.box_jenis.grid(row=0, column=1, padx=5, pady=5, sticky="ew")

        self.label_jenis_title = ctk.CTkLabel(self.box_jenis, text="JENIS BENCANA", text_color="gray")
        self.label_jenis_title.pack(pady=(15, 5))
        
        self.label_jenis_val = ctk.CTkLabel(self.box_jenis, text="-", font=ctk.CTkFont(size=24, weight="bold"))
        self.label_jenis_val.pack(pady=(0, 15))

    def analyze_report(self):
        teks = self.textbox.get("0.0", "end").strip()
        
        if not teks or teks == "Contoh: Air sungai mulai naik dan hujan deras dari pagi...":
            return
            
        if self.pipeline_status is None:
            return

        status_pred = self.pipeline_status.predict([teks])[0]
        jenis_pred = self.pipeline_jenis.predict([teks])[0]

        # Update UI Colors based on status
        self.label_status_val.configure(text=status_pred)
        self.label_jenis_val.configure(text=jenis_pred)

        if status_pred == "Aman":
            self.label_status_val.configure(text_color="#10B981") # Green
        elif status_pred == "Waspada":
            self.label_status_val.configure(text_color="#F59E0B") # Yellow
        else:
            self.label_status_val.configure(text_color="#EF4444") # Red

if __name__ == "__main__":
    app = SiagaDesaApp()
    app.mainloop()
