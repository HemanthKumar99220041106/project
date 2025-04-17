"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Play, ChevronRight, Trophy, Clock, BarChart2, CheckCircle2, XCircle, Terminal, Code2, FileText, GripVertical, ArrowLeft } from 'lucide-react';

// Dynamically import Monaco Editor with no SSR
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

const initialCode = `function findMaxSubarraySum(arr: number[]): number {
  // Write your solution here
}`;

const testCases = [
  {
    input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    expectedOutput: '6'
  },
  {
    input: '[1]',
    expectedOutput: '1'
  }
];

const languageTemplates = {
  typescript: `function findMaxSubarraySum(arr: number[]): number {
  // Write your solution here
}`,
  javascript: `function findMaxSubarraySum(arr) {
  // Write your solution here
}`,
  python: `def find_max_subarray_sum(arr):
    # Write your solution here
    pass`,
  java: `public class Solution {
    public int findMaxSubarraySum(int[] arr) {
        // Write your solution here
        return 0;
    }
}`,
  cpp: `int findMaxSubarraySum(vector<int>& arr) {
    // Write your solution here
    return 0;
}`
};

export default function MaximumSubarray() {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState('description');
  const [output, setOutput] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; output: string; expected: string }>>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(45);
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const containerWidth = window.innerWidth;
      const mouseX = e.clientX;
      const percentage = (mouseX / containerWidth) * 100;
      const newWidth = Math.min(Math.max(20, percentage), 80);
      setLeftPanelWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setCode(languageTemplates[newLanguage as keyof typeof languageTemplates]);
  };

  const runCode = () => {
    try {
      let fn;
      switch (selectedLanguage) {
        case 'typescript':
        case 'javascript':
          fn = new Function('arr', code.includes('return') ? code : `return ${code}`);
          break;
        default:
          setOutput('Language not supported for execution yet');
          setActiveTab('output');
          return;
      }

      const results = testCases.map(test => {
        const input = JSON.parse(test.input);
        const output = fn(input);
        const passed = output.toString() === test.expectedOutput;
        return {
          passed,
          input: test.input,
          output: output.toString(),
          expected: test.expectedOutput
        };
      });
      setTestResults(results);
      setOutput(null);
      setActiveTab('testcases');
    } catch (error) {
      setOutput((error as Error).toString());
      setActiveTab('output');
    }
  };

  const handleSubmit = () => {
    runCode();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col select-none">
      <div className="bg-[#252526] border-b border-[#3e3e42] p-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back to Challenges
        </Link>
      </div>
      <div className="flex flex-1">
        {/* Left Panel */}
        <div 
          className="bg-[#252526] border-r border-[#3e3e42] overflow-hidden flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div className="flex border-b border-[#3e3e42]">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'description' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('description')}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Description
              </div>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'testcases' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('testcases')}
            >
              <div className="flex items-center gap-2">
                <Code2 size={16} />
                Test Cases
              </div>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'output' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('output')}
            >
              <div className="flex items-center gap-2">
                <Terminal size={16} />
                Output
              </div>
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === 'description' && (
              <div className="text-gray-300">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white break-words">Maximum Subarray Sum</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">Easy</span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Trophy size={16} />
                      <span className="text-sm">2.5K</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-sm">15 min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="break-words">
                    Given an array of integers, find the contiguous subarray with the largest sum and return the sum.
                  </p>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Example 1:</h2>
                    <pre className="bg-[#1e1e1e] p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: The contiguous subarray [4, -1, 2, 1] has the largest sum = 6.
                    </pre>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Example 2:</h2>
                    <pre className="bg-[#1e1e1e] p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
Input: [1]
Output: 1
Explanation: The array has only one element, so the maximum sum is 1.
                    </pre>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>1 ≤ arr.length ≤ 10⁵</li>
                      <li>-10⁴ ≤ arr[i] ≤ 10⁴</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'testcases' && (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-[#1e1e1e] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle2 className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                      <span className="text-white font-medium">Test Case {index + 1}</span>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-gray-400 break-words">Input: {result.input}</div>
                      <div className="text-gray-400 break-words">Expected: {result.expected}</div>
                      <div className={`${result.passed ? 'text-green-400' : 'text-red-400'} break-words`}>
                        Output: {result.output}
                      </div>
                    </div>
                  </div>
                ))}
                {testResults.length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    Run your code to see test results
                  </div>
                )}
              </div>
            )}

            {activeTab === 'output' && (
              <div className="font-mono">
                {output ? (
                  <pre className="text-red-400 whitespace-pre-wrap break-words">{output}</pre>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No output to display
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Draggable Divider */}
        <div
          className={`w-1 bg-[#3e3e42] hover:bg-blue-500 cursor-col-resize flex items-center justify-center group transition-colors duration-150 ${isDragging ? 'bg-blue-500' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <GripVertical 
            size={16} 
            className="text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100"
          />
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#3e3e42] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={runCode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-150"
              >
                <Play size={16} />
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-150"
              >
                <ChevronRight size={16} />
                Submit
              </button>
            </div>
            <div className="flex items-center gap-4">
              <select 
                className="bg-[#3e3e42] text-white border border-[#3e3e42] rounded-lg px-3 py-2"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <button className="text-gray-400 hover:text-white transition-colors duration-150">
                <BarChart2 size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                theme: 'vs-dark',
                wordWrap: 'on',
                tabSize: 2,
                dragAndDrop: true,
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}