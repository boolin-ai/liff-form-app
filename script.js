// LIFF SDKの初期化
async function initializeLiff() {
    const liffId = '2000050276-Kjj7lW0L'; // あなたのLIFF IDに置き換えてください
    try {
        await liff.init({ liffId: liffId });
        if (liff.isLoggedIn()) {
            // ユーザープロファイルの取得
            const profile = await liff.getProfile();
            const userId = profile.userId; // ユーザーID
            const userName = profile.displayName; // ユーザー名

            // フォームの隠しフィールドにユーザーIDとユーザー名をセット
            document.getElementById('userId').value = userId;
            document.getElementById('userName').value = userName;
        } else {
            // ユーザーがログインしていない場合はログインを促す
            liff.login();
        }
    } catch (error) {
        console.error('LIFF Initialization failed', error);
    }
}

// フォーム送信のイベントリスナー設定
document.getElementById('submitForm').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトの送信を防止

    initializeLiff();

    // フォームからのデータを集める
    const formData = {
        q1: document.querySelector('input[name="q1"]:checked').value,
        q2: document.getElementById('name').value,
        q3: document.getElementById('email').value,
        q4: document.getElementById('phone').value,
        q5: document.getElementById('dob').value,
        q6: document.querySelector('input[name="q6"]:checked').value,
        q7: document.getElementById('datetime').value,
    };

    // 予約確認メッセージの組み立て
    const msg = `以下の内容で仮予約を受け付けました。\n
        メニュー選択: ${formData.q1}\n
        名前: ${formData.q2}\n
        メール: ${formData.q3}\n
        電話: ${formData.q4}\n
        生年月日: ${formData.q5}\n
        性別: ${formData.q6}\n
        日時候補: ${formData.q7}`;

    // LINEトークにメッセージを送信
    liff.sendMessages([{
        type: 'text',
        text: msg
    }])
    .then(() => {
        console.log('Message sent');
        liff.closeWindow(); // 応答後にLIFFアプリを閉じる
    })
    .catch(err => {
        console.error('Send Message failed', err);
    });
});

