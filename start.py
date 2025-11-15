import subprocess
import time
import sys
import os

def run_process(cmd, cwd=None):
    return subprocess.Popen(
        cmd,
        cwd=cwd,
        shell=True
    )

def main():
    backend_dir = "backend"
    frontend_dir = "frontend"

    print("Installing backend dependencies...")
    subprocess.run("npm install", cwd=backend_dir, shell=True)

    print("Installing frontend dependencies...")
    subprocess.run("npm install", cwd=frontend_dir, shell=True)

    print("Starting backend (node server.js)...")
    backend = run_process("node server.js", cwd=backend_dir)

    time.sleep(2)

    print("Starting frontend (npm run dev)...")
    frontend = run_process("npm run dev", cwd=frontend_dir)

    print("Frontend + Backend running. Press CTRL+C to stop.\n")

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend.terminate()
        frontend.terminate()
        sys.exit(0)


if __name__ == "__main__":
    main()