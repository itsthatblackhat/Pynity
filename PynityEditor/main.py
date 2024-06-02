import os
import subprocess

def main():
    electron_path = os.path.join(os.path.dirname(__file__), "node_modules", ".bin", "electron")
    subprocess.Popen([electron_path, "."], cwd=os.path.dirname(__file__))

if __name__ == "__main__":
    main()
