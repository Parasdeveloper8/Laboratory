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
var reusefuns_js_1 = require("./reusefuns.js");
var reusefuns_js_2 = require("./reusefuns.js");
//Ids from qna-page.html
var dialogBox = document.getElementById('dialogueBox');
var quesList = document.getElementById("questions-list");
var loader = document.getElementById("r-loader");
var searchValue = document.getElementById("search-value");
var quePen = document.getElementById("pen");
var closeDialogue = document.getElementById("closeDialog");
var addQuesForm = document.getElementById("addQues");
if (addQuesForm) {
    addQuesForm.addEventListener("submit", function (e) { return e.preventDefault(); });
} //Add event listener to form to prevent reloading
//Add event listener to form button to post question
document.addEventListener("DOMContentLoaded", function () {
    var addQuesBtn = document.getElementById("subBtn");
    if (addQuesBtn) {
        addQuesBtn.addEventListener("click", addQue);
    }
});
if (loader)
    loader.style.display = 'block';
var page = 1;
var limit = 5;
var row = 0;
var isLoading = false; // To prevent multiple fetches at once
// Open dialog box to put question
var openDialog = function () {
    if (dialogBox)
        dialogBox.style.display = 'block';
};
if (quePen)
    quePen.addEventListener("click", openDialog);
// Close dialog box to put question
var closeDialog = function () {
    if (dialogBox)
        dialogBox.style.display = 'none';
};
if (closeDialogue)
    closeDialogue.addEventListener("click", closeDialog);
//search question
function searchQuestion() {
    if (!searchValue)
        return;
    //convert HTMLElement to HTMLInputElement
    var searchVal = searchValue;
    var api = "http://localhost:4900/searchQues?val=".concat(searchVal.value);
    (0, reusefuns_js_2.search)(quesList, api, "No related question found", renderQues);
}
// Add question
var addQue = function () { return __awaiter(void 0, void 0, void 0, function () {
    var category, text, categoryValue, textValue, api, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                category = document.getElementById("select");
                text = document.getElementById("text");
                categoryValue = category.value;
                textValue = text.value;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                api = "http://localhost:4900/post-ques/".concat(textValue, "/").concat(categoryValue);
                return [4 /*yield*/, fetch(api, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    })];
            case 2:
                response = _a.sent();
                if (response.ok) {
                    closeDialog();
                    fetchQuestions(); // Refresh the questions after submitting
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error on posting question", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var api, response, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isLoading)
                    return [2 /*return*/]; // If the current fetch is still in progress, don't fetch again
                isLoading = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                api = "http://localhost:4900/ques-data/".concat(row, "/").concat(limit);
                return [4 /*yield*/, fetch(api)];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                // Check if there are no more questions to fetch
                if (data.data.length === 0) {
                    if (loader)
                        loader.style.display = 'none'; // Hide the loader
                    return [2 /*return*/]; // No more data, stop fetching
                }
                if (loader)
                    loader.style.display = 'none'; // Hide the loader when new data is fetched
                row += limit; // Update the row to the next set of questions
                page++; // Update page number for pagination
                renderQues(data.data); // Render new questions
                return [3 /*break*/, 6];
            case 4:
                error_2 = _a.sent();
                console.error("Error on fetching questions", error_2);
                return [3 /*break*/, 6];
            case 5:
                isLoading = false; // Allow new fetch once the current one finishes
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Render questions dynamically
var renderQues = function (questionsToDisplay) {
    questionsToDisplay.forEach(function (quest) {
        var Text = quest.Text, Username = quest.Username, Category = quest.Category, FormattedTime = quest.FormattedTime, Profile_Image = quest.Profile_Image, Id = quest.Id;
        var questionCard = document.createElement("div");
        questionCard.classList.add("col-12", "col-md-6", "mb-3"); // Use col-md-6 for 2 cards per row, col-12 for full width on small screens
        var shortenedUuid = Id.replace(/-/g, ''); // Remove hyphens
        questionCard.innerHTML = "\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <div class=\"d-flex justify-content-between align-items-center\">\n                        <div class=\"d-flex align-items-center\">\n                            <img src=\"".concat(Profile_Image ? "data:image/jpeg;base64,".concat(Profile_Image) : 'static/Images/avatar_face_only.png', "\" alt=\"User Icon\" style=\"width: 30px; height: 30px; margin-right: 8px;\">\n                            <strong>").concat(Username, "</strong>\n                        </div>\n                        <p class=\"text-muted\">").concat(FormattedTime, "</p>\n                    </div>\n                </div>\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">").concat(Text, "</h5>\n                    <p class=\"card-text\">category: ").concat(Category, "</p>\n                </div>\n                <button class=\"ans-btn\" id=\"ans-btn-").concat(shortenedUuid, "\">Add Answer</button>\n                <button class=\"show-ans-btn\" id=\"show-ans-btn-").concat(shortenedUuid, "\">Show Answers</button>\n            </div>\n\n            <div id=\"ansBox-").concat(shortenedUuid, "\" style=\"display:none;\" class=\"ans-dialog\">\n                <button class=\"close\" id=\"closeAnsBox-").concat(shortenedUuid, "\">X</button>\n                <div id=\"ans-loader-").concat(shortenedUuid, "\" class=\"loader\"></div>\n                <!-- Container for dynamically rendered answers -->\n                <div id=\"answers-container-").concat(shortenedUuid, "\" class=\"answers-container\"></div>\n            </div>\n\n            <div class=\"dialog\" id=\"postAnsDia-").concat(shortenedUuid, "\">\n                <button class=\"close\" id=\"close-ans-").concat(shortenedUuid, "\">X</button>\n                <form id=\"ans-form-").concat(shortenedUuid, "\">\n                    <input type=\"text\" placeholder=\"Your Answer here\" name=\"ans\" id=\"answerText-").concat(shortenedUuid, "\" style=\"border:2px solid black;\">\n                    <br>\n                    <br>\n                    <button type=\"submit\" class=\"sub-btn\">Post Answer</button>\n                </form>\n            </div>\n        ");
        if (!quesList)
            return;
        quesList.appendChild(questionCard); // Append the newly created card
        // Bind event listeners for the dynamically created buttons
        var ansBtn = document.getElementById("ans-btn-".concat(shortenedUuid));
        if (ansBtn)
            ansBtn.addEventListener("click", function () { return openPostAnsBox(shortenedUuid); });
        var closeAnsBtn = document.getElementById("close-ans-".concat(shortenedUuid));
        if (closeAnsBtn)
            closeAnsBtn.addEventListener("click", function () { return closePostAnsBox(shortenedUuid); });
        var ansForm = document.getElementById("ans-form-".concat(shortenedUuid));
        if (ansForm)
            ansForm.addEventListener("submit", function (event) { return subAns(event, shortenedUuid); });
        var ansBox = document.getElementById("show-ans-btn-".concat(shortenedUuid));
        if (ansBox)
            ansBox.addEventListener("click", function () { return openShowAnsBox(shortenedUuid, Text); });
        var closeAnsBtn2 = document.getElementById("closeAnsBox-".concat(shortenedUuid));
        if (closeAnsBtn2)
            closeAnsBtn2.addEventListener('click', function () { return closeAnsBox(shortenedUuid); });
    });
};
fetchQuestions();
// Open post answer dialogue box
var openPostAnsBox = function (id) {
    var postAnsDialogueBox = document.getElementById("postAnsDia-".concat(id));
    if (postAnsDialogueBox)
        postAnsDialogueBox.style.display = 'block';
};
// Close post answer dialogue box
var closePostAnsBox = function (id) {
    var postAnsDialogueBox = document.getElementById("postAnsDia-".concat(id));
    if (postAnsDialogueBox)
        postAnsDialogueBox.style.display = 'none';
};
// Submit Answer
var subAns = function (event, id) { return __awaiter(void 0, void 0, void 0, function () {
    var answerText, ansTextValue, api, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                answerText = document.getElementById("answerText-".concat(id));
                ansTextValue = answerText.value;
                api = "http://localhost:4900/post-ans/".concat(id, "/").concat(ansTextValue);
                return [4 /*yield*/, fetch(api, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    })];
            case 2:
                response = _a.sent();
                if (response.ok) {
                    closePostAnsBox(id);
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error on posting Answers", error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Close Answers Box
var closeAnsBox = function (id) {
    document.title = "Ques & Ans";
    var ansBox = document.getElementById("ansBox-".concat(id));
    if (!ansBox)
        return;
    ansBox.style.display = 'none';
};
// Open Answers box
var openShowAnsBox = function (id, ques) { return __awaiter(void 0, void 0, void 0, function () {
    var ansLoader, ansBox, answersContainer, response, data, response2, data2, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ansLoader = document.getElementById("ans-loader-".concat(id));
                if (ansLoader)
                    ansLoader.style.display = 'block';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                ansBox = document.getElementById("ansBox-".concat(id));
                answersContainer = document.getElementById("answers-container-".concat(id));
                if (!answersContainer)
                    return [2 /*return*/];
                answersContainer.innerHTML = ''; // Clear any previous content
                if (ansBox)
                    ansBox.style.display = 'block';
                return [4 /*yield*/, fetch("http://localhost:4900/answers/".concat(id))];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                return [4 /*yield*/, fetch("http://localhost:4900/likenums")];
            case 4:
                response2 = _a.sent();
                return [4 /*yield*/, response2.json()];
            case 5:
                data2 = _a.sent();
                if (ansLoader)
                    ansLoader.style.display = 'none';
                renderAnswers(data.data, id, ques, data2.data); // Render new answers
                // Ensure layout and scrollbar behavior is correct after rendering answers
                setTimeout(function () {
                    // Force a reflow to reset the overflow and ensure scrollbar visibility
                    document.body.style.overflowY = 'auto';
                }, 100);
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                console.error("Error fetching answers", error_4);
                if (ansLoader)
                    ansLoader.style.display = 'block';
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
//render answers
var renderAnswers = function (data1, id, ques, data2) {
    var answersContainer = document.getElementById("answers-container-".concat(id));
    if (!answersContainer)
        return;
    answersContainer.style.maxHeight = '380px';
    answersContainer.style.overflowY = 'auto';
    // Map the likes data by Ans_id for easier access
    var likesMap = data2.reduce(function (acc, item) {
        acc[item.Ans_id] = item.Likes_Number; // Store likes by Ans_id
        return acc;
    }, {});
    // Iterate over answers and render them
    data1.forEach(function (ans) {
        var Answer = ans.Answer, Username = ans.Username, Ans_id = ans.Ans_id;
        // Create a new div for the answer
        var anss = document.createElement("div");
        // Get the like count for the current answer, default to 0 if not found
        var likeCount = likesMap[Ans_id] || 0;
        document.title = ques;
        // Insert the answer and like information into the HTML
        anss.innerHTML = "\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <div class=\"d-flex justify-content-between align-items-center\">\n                        <div class=\"d-flex align-items-center\">\n                            <strong>".concat(Username, "</strong>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">Answer</h5>\n                    <p class=\"card-text\">").concat(Answer, "</p>\n                    <br>\n                    <div class=\"lk-div\">\n                        <button class=\"like-btn\" id=\"ans-id-").concat(Ans_id, "\">\n                            <i class=\"fa fa-thumbs-up\" aria-hidden=\"true\"></i>\n                        </button>\n                        <p class=\"like-count\" id=\"like-count-").concat(Ans_id, "\">").concat(likeCount, "</p>\n                    </div>\n                </div>\n            </div>\n        ");
        // Append the answer card to the answers container
        if (answersContainer)
            answersContainer.appendChild(anss);
        // Add event listener for the like button
        var likeBtn = document.getElementById("ans-id-".concat(Ans_id));
        if (likeBtn)
            likeBtn.addEventListener("click", function () { return addLikes(Ans_id); });
    });
};
// Like the answer and update the likes count
var addLikes = function (ans_id) { return __awaiter(void 0, void 0, void 0, function () {
    var api, response, likeBtn, likeCountElement, currentLikes, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                api = "http://localhost:4900/likes/".concat(ans_id);
                return [4 /*yield*/, fetch(api, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    })];
            case 1:
                response = _a.sent();
                // If the like was successfully posted, update the like button and count
                if (response.ok) {
                    likeBtn = document.getElementById("ans-id-".concat(ans_id));
                    likeBtn.disabled = true; // Disable the like button after clicking it
                    likeCountElement = document.getElementById("like-count-".concat(ans_id));
                    if (!likeCountElement)
                        return [2 /*return*/];
                    currentLikes = parseInt(likeCountElement.innerText) || 0;
                    likeCountElement.innerText = Number(currentLikes + 1).toString();
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error on adding Likes to answer", error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var searchBar = document.getElementById("search-bar");
if (searchBar)
    searchBar.addEventListener("submit", function (e) { return e.preventDefault(); });
document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchQuestion);
    }
});
// Scroll to load more questions
(0, reusefuns_js_1.scrollFetch)(fetchQuestions);
