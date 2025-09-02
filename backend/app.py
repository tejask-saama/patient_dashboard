from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src import api

#### Initialize app
app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"message": "API Healthy"}

# Include routers
app.include_router(api.router)



@app.on_event("startup")
async def startup_event():
    print('App startup complete')

@app.on_event("shutdown")
def shutdown_event():
    print('App shutdown complete')