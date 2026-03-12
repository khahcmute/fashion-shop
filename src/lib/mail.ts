import { transporter } from "@/lib/mailer";

const MAIL_FROM = process.env.MAIL_FROM || process.env.EMAIL_USER || "";

export async function sendEmailOtp(params: {
  to: string;
  name: string;
  otp: string;
}) {
  return transporter.sendMail({
    from: MAIL_FROM,
    to: params.to,
    subject: "Mã xác thực email của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Xin chào ${params.name},</h2>
        <p>Mã OTP xác thực email của bạn là:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">
          ${params.otp}
        </div>
        <p>Mã có hiệu lực trong 5 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
      </div>
    `,
  });
}

export async function sendProfileUpdatedEmail(params: {
  to: string;
  name: string;
}) {
  return transporter.sendMail({
    from: MAIL_FROM,
    to: params.to,
    subject: "Tài khoản của bạn vừa được cập nhật",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Xin chào ${params.name},</h2>
        <p>Thông tin tài khoản của bạn tại <strong>Fashion Shop</strong> vừa được cập nhật thành công.</p>
        <p>Nếu bạn không thực hiện thay đổi này, hãy liên hệ hỗ trợ ngay.</p>
      </div>
    `,
  });
}
