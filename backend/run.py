#!/usr/bin/env python
import uvicorn
import argparse
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Run the Restaurant API server")
    parser.add_argument(
        "--host", 
        type=str, 
        default="0.0.0.0", 
        help="Host to bind the server to"
    )
    parser.add_argument(
        "--port", 
        type=int, 
        default=8000, 
        help="Port to bind the server to"
    )
    parser.add_argument(
        "--reload", 
        action="store_true", 
        help="Enable auto-reload on code changes"
    )
    parser.add_argument(
        "--env", 
        type=str, 
        choices=["development", "production", "test"], 
        default=os.getenv("ENVIRONMENT", "development"),
        help="Environment to run the server in"
    )
    parser.add_argument(
        "--workers", 
        type=int, 
        default=1, 
        help="Number of worker processes"
    )

    args = parser.parse_args()
    
    # Set environment variable
    os.environ["ENVIRONMENT"] = args.env
    
    # Configure Uvicorn
    uvicorn_config = {
        "app": "app.main:app",
        "host": args.host,
        "port": args.port,
        "reload": args.reload,
        "workers": args.workers if args.env == "production" else 1,
        "log_level": "info" if args.env == "production" else "debug",
    }
    
    print(f"Starting server in {args.env} mode on http://{args.host}:{args.port}")
    uvicorn.run(**uvicorn_config)

if __name__ == "__main__":
    main()
