import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import Editor from "@monaco-editor/react";
import { Terminal as TerminalIcon, Play, ShieldAlert, Activity } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/AuthContext';


const socket = io('http://localhost:4000');

export default function dashboard() {
  const terminalRef = useRef(null);
  const xterm = useRef(null);
  const [status, setStatus] = useState('READY');
  const options = ["python", "javascript"];
  const [selected, setSelected] = useState("javascript");
  const [myJobs, setMyJobs] = useState(null);
  const [code, setCode] = useState('console.log("Result is: " + (5 * 20));\n\n// Try an infinite loop to test resource limits:\n// while(true) { console.log("Hacking...") }');
  const { user } = useContext(UserContext)

  useEffect(() => {
    setCode(selected === "javascript" ? 'console.log("Result is: " + (5 * 20));\n\n// Try an infinite loop to test resource limits:\n// while(true) { console.log("Hacking...") }' : 'print(f"Result is: {5 * 20}")\n\n# Try an infinite loop to test resource limits:\n# while True: print("Hacking...")');
  }, [selected]);


  useEffect(() => {
    // Initialize XTerm.js
    xterm.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#00ff41', // Classic Matrix Green
        cursor: '#00ff41'
      },
      fontFamily: 'monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    xterm.current.loadAddon(fitAddon);
    xterm.current.open(terminalRef.current);
    fitAddon.fit();

    xterm.current.writeln('\x1b[32m[SYSTEM] Initializing distributed mesh...\x1b[0m');
    xterm.current.writeln('\x1b[32m[SYSTEM] Socket connection: ACTIVE\x1b[0m');

    return () => socket.disconnect();
  }, []);


const runCode = async () => {
  setStatus('EXECUTING');
  xterm.current?.clear();
  xterm.current?.writeln('\x1b[33m[PROCESS] Sending job...\x1b[0m');

  try {
    const res = await axiosInstance.post('/gateway/data', {
      language: selected,
      code
    });

    const { jobId } = res.data.data;

    setMyJobs(jobId);

    xterm.current?.writeln(
      `\x1b[36m[QUEUE] Job ID: ${jobId} allocated.\x1b[0m`
    );

    socket.emit('join-job', jobId);

  } catch (err) {
    xterm.current?.writeln(
      '\x1b[31m[ERROR] Failed to reach submission-service\x1b[0m'
    );
  } finally {
    setStatus('READY');
  }
};

useEffect(() => {
  const handler = (log) => {
    xterm.current?.write(log);
  };

  socket.on(`job-${myJobs}`, handler);

  return () => {
    socket.off(`job-${myJobs}`, handler);
  };
}, [myJobs]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 selection:bg-green-900">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-green-900 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-600 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tighter">ARES-MESH // CORE_NODE_01</h1>
        </div>
        {user.user.role === 'admin' && (<Link to="/Admin" className='bg-green-600 rounded-sm text-black p-2 hover:bg-green-400 '>Admin page</Link>)}
        <div className="flex gap-8 text-xs">
          <div className="flex items-center gap-2"><Activity size={14} /> CPU: 0.18%</div>
          <div className="text-green-800">Uptime: 14:22:01</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Editor Section */}
        <div className="col-span-7 border border-green-900 bg-black/50 overflow-hidden rounded-sm">
          <div className="bg-green-900/10 p-2 border-b border-green-900 flex justify-between items-center">
            <span className="text-xs uppercase px-2">Source_Code.{selected === "javascript" ? "js" : selected === "python" ? "py" : "txt"}</span>

            <select value={selected} onChange={(e) => setSelected(e.target.value)} className='flex items-center gap-2 outline-none bg-transparent border-2 border-green-900 text-green-500 px-4 py-1 text-xs font-bold '>

              {options.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <button
              onClick={runCode}
              disabled={status === 'EXECUTING'}
              className="flex items-center gap-2 bg-green-600 text-black px-4 py-1 text-xs font-bold hover:bg-green-400 disabled:bg-gray-800 transition-colors"
            >
              <Play size={12} fill="black" /> {status === 'EXECUTING' ? 'RUNNING...' : 'EXECUTE'}
            </button>
          </div>
          <Editor
            height="500px"
            language={selected}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{ minimap: { enabled: false }, fontSize: 16 }}
            onKeyDown={(e) => {
              console.log("Key:", e.key);
            }}
          />
        </div>

        {/* Terminal Section */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="flex-1 border border-green-900 p-4 bg-black relative rounded-sm">
            <div className="absolute top-2 right-4 text-[10px] text-green-900 flex items-center gap-1">
              <TerminalIcon size={10} /> LIVE_FEED
            </div>
            <div ref={terminalRef} className="h-full w-full" />
          </div>

          {/* Status Panel */}
          <div className="h-32 border border-green-900 p-4 bg-green-900/5 text-[10px] uppercase space-y-1">
            <p className="text-green-700 underline mb-2">System Analytics</p>
            <p>Node_Status: {status}</p>
            <p>Network: Isolated_Bridge</p>
            <p>Memory_Limit: 128MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}