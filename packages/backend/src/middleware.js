import { NextResponse } from 'next/server';

export function middleware(request) {
    // Tạo một response mới để có thể chỉnh sửa headers
    const response = NextResponse.next();

    // Thêm header cho phép origin của frontend được truy cập
    // Trong môi trường production, bạn nên thay '*' bằng domain của frontend
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Cho phép các phương thức HTTP
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Cho phép các header cụ thể
    response.headers.set('Access-control-Allow-Headers', 'Content-Type, Authorization');

    // Xử lý các request OPTIONS (preflight) mà trình duyệt gửi trước
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    return response;
}

// Config để middleware này chỉ áp dụng cho các đường dẫn API
export const config = {
    matcher: '/api/:path*',
};