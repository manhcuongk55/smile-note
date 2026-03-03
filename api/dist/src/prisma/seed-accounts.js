"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const accounts = [
        { id: '111', name: 'Tiền mặt (Cash)', type: 'ASSET', level: 1 },
        { id: '112', name: 'Tiền gửi Ngân hàng (Bank)', type: 'ASSET', level: 1 },
        { id: '131', name: 'Phải thu khách hàng (AR)', type: 'ASSET', level: 1 },
        { id: '156', name: 'Hàng hóa (Inventory)', type: 'ASSET', level: 1 },
        {
            id: '211',
            name: 'Tài sản cố định (Fixed Assets)',
            type: 'ASSET',
            level: 1,
        },
        {
            id: '242',
            name: 'Chi phí trả trước (Prepaid Expenses)',
            type: 'ASSET',
            level: 1,
        },
        { id: '331', name: 'Phải trả người bán (AP)', type: 'LIABILITY', level: 1 },
        {
            id: '3386',
            name: 'Nhận ký quỹ, ký cược (Tenant Deposits)',
            type: 'LIABILITY',
            level: 1,
        },
        {
            id: '3387',
            name: 'Doanh thu chưa thực hiện (Deferred Revenue)',
            type: 'LIABILITY',
            level: 1,
        },
        {
            id: '411',
            name: 'Vốn góp của chủ sở hữu (Equity)',
            type: 'EQUITY',
            level: 1,
        },
        {
            id: '421',
            name: 'Lợi nhuận sau thuế chưa phân phối (Retained Earnings)',
            type: 'EQUITY',
            level: 1,
        },
        {
            id: '511',
            name: 'Doanh thu bán hàng và cung cấp dịch vụ (Revenue)',
            type: 'REVENUE',
            level: 1,
        },
        {
            id: '515',
            name: 'Doanh thu hoạt động tài chính',
            type: 'REVENUE',
            level: 1,
        },
        { id: '632', name: 'Giá vốn hàng bán (COGS)', type: 'EXPENSE', level: 1 },
        {
            id: '642',
            name: 'Chi phí quản lý doanh nghiệp (Admin Expenses)',
            type: 'EXPENSE',
            level: 1,
        },
        {
            id: '711',
            name: 'Thu nhập khác (Other Income)',
            type: 'REVENUE',
            level: 1,
        },
        {
            id: '811',
            name: 'Chi phí khác (Other Expenses)',
            type: 'EXPENSE',
            level: 1,
        },
    ];
    console.log('Seeding Chart of Accounts...');
    for (const account of accounts) {
        await prisma.account.upsert({
            where: { id: account.id },
            update: account,
            create: account,
        });
    }
    console.log('CoA Seeding completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-accounts.js.map