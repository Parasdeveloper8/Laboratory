"use strict";
//All reusable functions
//ES modules
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.scrollFetch = scrollFetch;
exports.formatLike = formatLike;
exports.showCommentsDialog = showCommentsDialog;
exports.search = search;
//This function runs callback function when user
//reach at bottom of page
function scrollFetch(callback) {
    // Adding scroll event to load more blogs when scrolled to the bottom
    window.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY + window.innerHeight;
        var documentHeight = document.documentElement.scrollHeight;
        if (scrollPosition >= documentHeight - 10) {
            //Callback function will be run
            callback();
        }
    });
}
//This function is used to format likes on behalf of their number
//Adding K,M,B after likes
//num is number of likes
//countpara is  HTMLParagraphElement
function formatLike(num, countpara) {
    if (num >= 1000 && num < 1000000) {
        var divide = num / 1000;
        var result = divide + "K";
        countpara.innerText = result;
    }
    else if (num >= 1000000 && num < 1000000000) {
        var divide = num / 1000000;
        var result = divide + "M";
        countpara.innerText = result;
    }
    else if (num >= 1000000000) {
        var divide = num / 1000000000;
        var result = divide + "B";
        countpara.innerText = result;
    }
    else {
        countpara.innerText = String(num);
    }
}
//This function shows comments'dialog box which contains comments
function showCommentsDialog(comments) {
    var dialog = document.createElement("div");
    dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; max-height: 300px; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow-y: auto; z-index: 1000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";
    var closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = "position: absolute; top: 10px; right: 10px; background: #ff5f5f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
    closeButton.addEventListener("click", function () { return dialog.remove(); });
    dialog.appendChild(closeButton);
    if (comments.length > 0) {
        comments.forEach(function (comment) {
            var commentItem = document.createElement("div");
            commentItem.style.cssText = "padding: 10px 0; border-bottom: 1px solid #ddd;";
            // Comment text
            var commentText = document.createElement("div");
            commentText.textContent = "".concat(comment.UserName, ": ").concat(comment.Comment_Text);
            commentItem.appendChild(commentText);
            // Comment time
            var commentTime = document.createElement("div");
            var formattedTime = new Date(comment.FormattedTimeComment).toLocaleString(); // Format the timestamp
            commentTime.textContent = "Posted on: ".concat(formattedTime);
            commentTime.style.cssText = "font-size: 12px; color: #777; margin-top: 5px;";
            commentItem.appendChild(commentTime);
            dialog.appendChild(commentItem);
        });
    }
    else {
        var noComments = document.createElement("div");
        noComments.textContent = "No comments yet.";
        noComments.style.cssText = "padding: 10px 0; color: #777;";
        dialog.appendChild(noComments);
    }
    document.body.appendChild(dialog);
}
//This function searches posts and questions
//It can be adjusted according to parameters
//This is reusable 
function search(div, api, failInfo, renderFunction) {
    return __awaiter(this, void 0, void 0, function () {
        var searchAPI, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    div.innerHTML = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    searchAPI = api;
                    return [4 /*yield*/, fetch(searchAPI, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.data == null) {
                        div.innerHTML = "<p style='text-align:center;padding-top:10%;'>&#128528; ".concat(failInfo, "</p>");
                    }
                    renderFunction(data.data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Failed to search", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
