# UX Clarity Guide: Feedback Flow v1.0

### What is this screen?
The **Thảo luận** (Discussion) bubble provides a direct channel for communication on specific property management tasks and contracts. It replaces static notes with a dynamic, real-time conversation layer.

### What should I do here?
- **View Progress**: Read feedback from other roles (e.g., a technician reporting an issue, a manager approving a step).
- **Post Updates**: Type your feedback or questions in the input field and hit enter or the send icon.
- **Track Logs**: Use the centralized "Phản hồi" link on the dashboard to see an overview of all recent activity.

### What happens next?
- Your team members will see a notification dot on their screens.
- All feedback is permanently logged and linked to the specific room/building for future audit.

### What if something fails?
- Ensure you have an active internet connection.
- If the message doesn't appear immediately, try refreshing the page.

---

## Inline Help Panel JSON

```json
{
  "screen_id": "FEEDBACK_CHAT_V1",
  "tooltip_steps": [
    { 
      "step": 1, 
      "text": "Nhấn vào biểu tượng tin nhắn xanh lá ở góc dưới bên phải để mở khung thảo luận." 
    },
    { 
      "step": 2, 
      "text": "Xem các phản hồi cũ từ đồng nghiệp hoặc cấp trên để nắm bắt tình hình." 
    },
    { 
      "step": 3, 
      "text": "Nhập nội dung mới vào ô trống và nhấn gửi để lưu lại log cho hành động này." 
    }
  ],
  "quick_hint": "Tất cả phản hồi ở đây đều được lưu lại và đồng bộ lên trang quản trị chung."
}
```
