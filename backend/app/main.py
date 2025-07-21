from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "message": "AI Cost Optimizer API",
            "status": "healthy",
            "version": "1.0.0",
            "path": self.path,
            "database_url_set": bool(os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL")),
            "environment": os.getenv("ENVIRONMENT", "development")
        }
        
        self.wfile.write(json.dumps(response).encode())
        return 