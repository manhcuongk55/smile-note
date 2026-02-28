"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const common_1 = require("@nestjs/common");
const route_service_1 = require("./route.service");
let RouteController = class RouteController {
    routeService;
    constructor(routeService) {
        this.routeService = routeService;
    }
    async getTodayRoute(managerId) {
        return this.routeService.getOptimizedRoute(managerId);
    }
};
exports.RouteController = RouteController;
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Query)('managerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "getTodayRoute", null);
exports.RouteController = RouteController = __decorate([
    (0, common_1.Controller)('route'),
    __metadata("design:paramtypes", [route_service_1.RouteService])
], RouteController);
//# sourceMappingURL=route.controller.js.map