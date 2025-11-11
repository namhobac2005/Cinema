export async function login(credentials) {
  // credentials sẽ là { username: '...', password: '...' }

  try {
    const response = await fetch('http://localhost:5000/login', {
      // 1. Gọi API back-end
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials), // 2. Gửi username/password đi
    });

    const data = await response.json();

    if (!response.ok) {
      // 3. Bắt lỗi nếu server trả về 401 (sai pass) hoặc 500
      throw new Error(data.message || 'Đăng nhập thất bại');
    }

    // 4. Trả về dữ liệu
    return data;
  } catch (err) {
    // 5. Ném lỗi ra để component (Login.jsx) bắt
    console.error('Lỗi khi gọi API login:', err);
    throw err;
  }
}
