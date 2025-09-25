// Firebaseのサービスを取得
const auth = firebase.auth();
const database = firebase.database();

// ログイン状態をチェック
auth.onAuthStateChanged(user => {
  if (user) {
    // ログインしている場合
    console.log('ログイン中:', user.email);
    document.getElementById('content').textContent = 'ログイン成功！';

    // データベースからデータを読み込んで表示
    const dbRef = database.ref('messages');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      document.getElementById('content').innerHTML = ''; // 一旦クリア
      for (let key in data) {
        const p = document.createElement('p');
        p.textContent = data[key].message;
        document.getElementById('content').appendChild(p);
      }
    });

  } else {
    // ログインしていない場合
    const email = prompt("メールアドレスを入力してください");
    const password = prompt("パスワードを入力してください");
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.error('ログインエラー:', error);
        alert('ログインに失敗しました。');
      });
  }
});

// 送信ボタンの処理
document.getElementById('sendButton').addEventListener('click', () => {
  const textInput = document.getElementById('textInput');
  const message = textInput.value;
  if (message) {
    // データベースに新しいメッセージを追加
    database.ref('messages').push({
      message: message,
      timestamp: Date.now()
    });
    textInput.value = '';
  }
});
