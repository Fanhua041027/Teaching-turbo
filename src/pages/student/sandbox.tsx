import { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const codeTemplates = {
  python: `# Python示例代码
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`,
  javascript: `// JavaScript示例代码
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5));`
};

const mockResults = {
  python: "55",
  javascript: "120"
};

export default function Sandbox() {
  const [code, setCode] = useState(codeTemplates.python);
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 3D可视化初始化
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 5);
    controls.update();

    // 创建训练数据点
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 100; i++) {
      points.push(new THREE.Vector3(
        Math.sin(i * 0.2) * 3,
        Math.cos(i * 0.3) * 3,
        Math.sin(i * 0.1) * 3
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({
      color: 0x3E92CC,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      pointCloud.rotation.x += 0.001;
      pointCloud.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // 窗口大小调整
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // 模拟AI建议
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiSuggestions([
        "使用递归实现斐波那契数列",
        "考虑添加输入验证",
        "可以优化为迭代方式提高性能"
      ]);
    }, 2000);
    return () => clearTimeout(timer);
  }, [code]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    setErrors("");
    
    // 模拟代码执行过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setOutput(`执行结果: ${mockResults[language]}`);
      }
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCode(`${code}\n# AI建议: ${suggestion}`);
    toast.success("建议已插入到代码中");
  };

  const handleLanguageChange = (lang: "python" | "javascript") => {
    setLanguage(lang);
    setCode(codeTemplates[lang]);
    setOutput("");
    setErrors("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* 顶部导航 */}
      <div className="bg-[#0A2463] p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">代码沙箱</h1>
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as "python" | "javascript")}
            className="bg-[#3E92CC] text-white px-3 py-1 rounded"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isRunning ? (
              <span className="flex items-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                运行中 ({progress}%)
              </span>
            ) : (
              <span>
                <i className="fa-solid fa-play mr-2"></i>
                运行代码
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 学习进度条 */}
      <div className="h-1 bg-gray-800">
        <div 
          className="h-full bg-[#3E92CC] transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* 代码编辑器 */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-700 text-sm font-mono">
            <i className="fa-solid fa-code mr-2"></i>
            editor.py
          </div>
          <div className="flex-1 overflow-auto">
<Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => Prism.highlight(code, Prism.languages[language], language)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: "#1e1e1e",
                minHeight: "100%"
              }}
            />
          </div>
        </div>

        {/* 3D可视化 */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-700 text-sm font-mono">
            <i className="fa-solid fa-cube mr-2"></i>
            训练过程可视化
          </div>
          <div 
            ref={canvasRef} 
            className="flex-1 bg-gray-900"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* 控制台输出 */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-700 text-sm font-mono">
            <i className="fa-solid fa-terminal mr-2"></i>
            控制台
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto">
            {output && <div className="text-green-400">{output}</div>}
            {errors && <div className="text-red-400">{errors}</div>}
            {!output && !errors && (
              <div className="text-gray-400">代码执行结果将显示在这里...</div>
            )}
          </div>
        </div>
      </div>

      {/* AI建议面板 */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <h3 className="text-sm font-semibold mb-2">
          <i className="fa-solid fa-robot mr-2"></i>
          AI代码建议
        </h3>
        <div className="flex flex-wrap gap-2">
          {aiSuggestions.length > 0 ? (
            aiSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-[#3E92CC]/20 text-[#3E92CC] rounded-full text-sm hover:bg-[#3E92CC]/30"
              >
                {suggestion}
              </motion.button>
            ))
          ) : (
            <div className="text-gray-400 text-sm">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              AI正在分析代码...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}