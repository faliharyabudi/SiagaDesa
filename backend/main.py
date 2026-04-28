from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

app = FastAPI(title="SiagaDesa API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

pipeline_status = Pipeline([('tfidf', TfidfVectorizer()), ('clf', MultinomialNB())])
pipeline_jenis = Pipeline([('tfidf', TfidfVectorizer()), ('clf', MultinomialNB())])

pipeline_status.fit(df['laporan'], df['status'])
pipeline_jenis.fit(df['laporan'], df['jenis_bencana'])

class ReportRequest(BaseModel):
    laporan: str

@app.post("/analyze")
def analyze_report(request: ReportRequest):
    teks = request.laporan
    status_pred = pipeline_status.predict([teks])[0]
    jenis_pred = pipeline_jenis.predict([teks])[0]
    return {
        "laporan": teks,
        "status": status_pred,
        "jenis_bencana": jenis_pred
    }

@app.get("/")
def read_root():
    return {"message": "SiagaDesa API is running."}
