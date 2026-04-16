import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 文件下载工具函数
export async function downloadFile(url: string, filename: string) {
  try {
    toast.info('开始下载文件...');
    
    // 如果是模拟文件
    if (url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      
      toast.success(`${filename} 下载成功`);
      return true;
    }
    
    // 真实文件下载
    const response = await fetch(url);
    if (!response.ok) throw new Error('下载失败');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // 延迟释放URL
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    }, 100);
    
    toast.success(`${filename} 下载成功`);
    return true;
  } catch (error) {
    console.error('下载错误:', error);
    toast.error(`文件下载失败: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 文件上传工具函数
export async function uploadFile(file: File, uploadUrl: string = '/api/upload') {
  try {
    toast.info(`正在上传 ${file.name}...`);
    
    // 模拟上传
    if (uploadUrl === '/api/upload') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResponse = {
            url: URL.createObjectURL(file),
            filename: file.name,
            size: file.size,
            type: file.type
          };
          toast.success(`${file.name} 上传成功`);
          resolve(mockResponse);
        }, 1500);
      });
    }
    
    // 真实上传
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('上传失败');
    
    const data = await response.json();
    toast.success(`${file.name} 上传成功`);
    return data;
  } catch (error) {
    console.error('上传错误:', error);
    toast.error(`文件上传失败: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

// 模拟文件数据生成
export function generateMockFile(type: string, size: number): { url: string, filename: string } {
  const extensions = {
    'PDF': 'pdf',
    'ZIP': 'zip',
    'MP4': 'mp4',
    'PPT': 'pptx',
    'DOC': 'docx',
    'XLS': 'xlsx',
    'JPG': 'jpg',
    'PNG': 'png'
  };
  
  const ext = extensions[type] || 'bin';
  const filename = `${type.toLowerCase()}-${Date.now()}.${ext}`;
  const mockData = new Blob(['0'.repeat(size * 1024)], { 
    type: type === 'MP4' ? 'video/mp4' : 
         type === 'JPG' ? 'image/jpeg' :
         type === 'PNG' ? 'image/png' :
         `application/${ext}` 
  });
  
  return {
    url: URL.createObjectURL(mockData),
    filename
  };
}
