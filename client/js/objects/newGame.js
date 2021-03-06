"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("../../lib/jquery/jquery-3.4.1.min");
var localStorage_1 = require("../objects/localStorage");
var Swal = require("../../lib/sweetalert2.all.min");
function dialogGame(link) {
    var _this = this;
    var name;
    var swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        }
    });
    swalWithBootstrapButtons.fire({
        confirmButtonText: 'Ďalej &rarr;',
        showCloseButton: true,
        title: 'Zadaj meno',
        input: 'text'
    }).then(function (result) {
        if (result.value) {
            name = result.value;
            swalWithBootstrapButtons.fire({
                title: 'Typ hry',
                showCancelButton: true,
                showCloseButton: true,
                confirmButtonText: '<i class="fas fa-user"></i> Jeden hráč',
                cancelButtonText: '<i class="fas fa-users"></i> Viac hráčov'
            }).then(function (result) {
                if (result.value) {
                    swalWithBootstrapButtons.fire({
                        title: 'Veľa šťastia, ' + name,
                        showCloseButton: true,
                        confirmButtonText: 'Idem hrať!'
                    }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        var object;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!result.value) return [3 /*break*/, 2];
                                    object = link.split('_')[1];
                                    return [4 /*yield*/, instanceLoading(object, 'singleplayer', name)];
                                case 1:
                                    _a.sent();
                                    location.replace(link + '_singleplayer.html');
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Veľa šťastia, ' + name,
                        showCloseButton: true,
                        confirmButtonText: 'Idem hrať!'
                    }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        var object;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!result.value) return [3 /*break*/, 2];
                                    object = link.split('_')[1];
                                    return [4 /*yield*/, instanceLoading(object, 'multiplayer', name)];
                                case 1:
                                    _a.sent();
                                    location.replace(link + '_multiplayer.html');
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            });
        }
    });
}
exports.dialogGame = dialogGame;
function instanceLoading(object, typeOfGame, name) {
    return new Promise(function (resolve) {
        var loader = new localStorage_1.LocalStorage();
        loader.save(object, typeOfGame, name);
        resolve('ok');
    });
}
function setOnButtonClick(div, args) {
    $(document).ready(function () {
        $(div).on("click", function () {
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var Func = args_1[_i];
                eval(Func);
            }
        });
    });
    /*$(document).ready(function(){
        var fun = '';
        for(var Func of args) {
            fun += Func + ";";
        }
        fun = fun.substring(0, fun.length - 1);
        console.log('fun ' + fun);
        console.log('div ' +  $(div));
        $(div).attr("onclick", fun);
    })*/
}
exports.setOnButtonClick = setOnButtonClick;
//# sourceMappingURL=newGame.js.map