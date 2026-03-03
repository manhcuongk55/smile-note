"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const tasks_module_1 = require("./tasks/tasks.module");
const buildings_module_1 = require("./buildings/buildings.module");
const rooms_module_1 = require("./rooms/rooms.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const contracts_module_1 = require("./contracts/contracts.module");
const finance_automation_module_1 = require("./finance-automation/finance-automation.module");
const accounting_module_1 = require("./accounting/accounting.module");
const rule_engine_module_1 = require("./rule-engine/rule-engine.module");
const compliance_module_1 = require("./compliance/compliance.module");
const utility_billing_module_1 = require("./utility-billing/utility-billing.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tasks_module_1.TasksModule,
            buildings_module_1.BuildingsModule,
            rooms_module_1.RoomsModule,
            dashboard_module_1.DashboardModule,
            contracts_module_1.ContractsModule,
            finance_automation_module_1.FinanceAutomationModule,
            accounting_module_1.AccountingModule,
            rule_engine_module_1.RuleEngineModule,
            compliance_module_1.ComplianceModule,
            utility_billing_module_1.UtilityBillingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map