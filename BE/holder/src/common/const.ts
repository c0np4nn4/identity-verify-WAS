export const REGISTER_EMAIL_TEMPLATE = (code: string) => {
  return `
    <div style="font-family: 'Arial', sans-serif; color: #333;">
        <h1 style="background-color: #f2f2f2; padding: 10px; text-align: center;">본인 인증 코드 안내</h1>
        <p>안녕하세요. 인증 코드를 알려드립니다.</p>
        <h2><strong>인증 코드:</strong> ${code}</h2>
        <p style="color: #ff0000;">* 주의사항 *</p>
        <ul>
            <li>인증코드는 발송시간으로부터 5분간 유효합니다.</li>
            <li>유효한 인증시간이 지난 경우에는 인증코드를 다시 발급 받아야 합니다.</li>
        </ul>
        <p>이 메일은 발신 전용 메일이므로 회신이 불가능합니다. 자세한 사항은 홈페이지를 참고해주시기 바랍니다.</p>
    </div>`;
};
