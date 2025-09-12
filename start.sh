#!/bin/bash

echo "🎓 幼儿英语学习乐园启动脚本"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js 16.0或更高版本"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

echo "🚀 启动开发服务器..."
echo "🌐 应用将在 http://localhost:3000 打开"
echo "📱 支持移动端访问"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

npm run dev
