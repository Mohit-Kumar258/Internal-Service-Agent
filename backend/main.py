from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.tickets import router as tickets_router
from database.mongodb import test_connection
from routes.audit import router as audit_router
from routes.knowledge import router as knowledge_router
from routes.chat import router as chat_router
from routes.dashboard import router as dashboard_router

app = FastAPI(title="Veridian IT Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://internal-service-agent.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(tickets_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(chat_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Veridian IT Agent API is running"}


@app.get("/test-db")
def test_db():
    return test_connection()


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)