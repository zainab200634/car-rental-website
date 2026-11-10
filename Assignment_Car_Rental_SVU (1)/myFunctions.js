/**
 * ==========================================================================
 * ملف التوابع البرمجية الموحد (myFunctions.js)
 * وفق متطلبات سلم تصحيح وظيفة تصميم وتطوير تطبيقات الوب - SVU (F25)
 * برمجة نظيفة تعتمد على JavaScript المعيارية ومكتبة jQuery المضمنة محلياً
 * ==========================================================================
 */

$(document).ready(function () {

    // ----------------------------------------------------------------------
    // [السؤال 1.3]: سلوك إظهار وإخفاء تفاصيل السيارات عبر مكتبة jQuery
    // ----------------------------------------------------------------------
    $(".chk-details").on("change", function () {
        var targetRowId = $(this).attr("data-target");
        var detailsRow = $("#" + targetRowId);

        if ($(this).is(":checked")) {
            // إظهار التفاصيل بتأثير انزلاق ناعم
            detailsRow.fadeIn(250);
        } else {
            // إخفاء التفاصيل
            detailsRow.fadeOut(200);
        }
    });

    // ----------------------------------------------------------------------
    // [السؤال 1.4]: سلوك زر "متابعة" بعد اختيار السيارة / السيارات
    // ----------------------------------------------------------------------
    $("#btnProceed").on("click", function () {
        var selectedCars = $(".chk-select:checked");

        if (selectedCars.length === 0) {
            alert("تنبيه: يرجى تحديد سيارة واحدة على الأقل من الجدول عبر تفعيل مربع (اختيار) للمتابعة.");
            return;
        }

        // إظهار قسم نموذج الحجز في نفس الصفحة باستخدام jQuery
        $("#orderSection").slideDown(500, function () {
            // تمرير الشاشة بسلاسة إلى النموذج
            $('html, body').animate({
                scrollTop: $("#orderSection").offset().top - 20
            }, 600);
        });

        // تحديث ملخص السيارات المختارة
        updateSelectedCarsSummary();
    });

    // عند تغيير تحديد أي سيارة، نحدث الملخص تلقائياً
    $(".chk-select").on("change", function () {
        if ($("#orderSection").is(":visible")) {
            updateSelectedCarsSummary();
        }
    });

    // إغلاق النافذة المنبثقة للنتيجة
    $("#btnCloseModal").on("click", function () {
        $("#resultModal").fadeOut(300);
    });

});

/**
 * تحديث حقل عرض السيارات المختارة في النموذج
 */
function updateSelectedCarsSummary() {
    var carNames = [];
    var count = 0;

    $(".chk-select:checked").each(function () {
        count++;
        carNames.push($(this).attr("data-name") + " [" + $(this).attr("data-code") + "]");
    });

    if (count > 0) {
        $("#txtSelectedCarsDisplay").val(carNames.join(" ، "));
    } else {
        $("#txtSelectedCarsDisplay").val("لم يتم اختيار أية سيارة بعد");
    }
}


// --------------------------------------------------------------------------
// [السؤال 1.4]: التحقق البرمجي الصارم وحساب المبالغ والخصم (سلم العلامات)
// --------------------------------------------------------------------------

/**
 * دالة التحقق من استمارة حجز السيارات وحساب أيام التأجير والخصومات
 */
function validateOrderForm() {
    var isValid = true;

    // 0. التحقق من اختيار سيارة واحدة على الأقل
    var selectedCheckboxes = $(".chk-select:checked");
    if (selectedCheckboxes.length === 0) {
        alert("يرجى اختيار سيارة واحدة على الأقل من الجدول أعلاه لتثبيت الحجز.");
        return false;
    }

    // 1. التحقق من الاسم الكامل (أحرف هجائية عربية فقط وفراغات) - اختياري، ويفحص إن أدخل
    var fullName = document.getElementById("txtFullName").value.trim();
    var nameError = document.getElementById("errFullName");
    var arabicPattern = /^[\u0621-\u064A\s]+$/;

    if (fullName !== "") {
        if (!arabicPattern.test(fullName)) {
            nameError.innerText = "الاسم يجب أن يحتوي على أحرف هجائية عربية وفراغات فقط.";
            nameError.style.display = "block";
            isValid = false;
        } else {
            nameError.style.display = "none";
        }
    } else {
        nameError.style.display = "none";
    }

    // 2. التحقق من الرقم الوطني (إلزامي الإدخال - 11 خانة - أول خانتين ترمز للمحافظة 01-14)
    var nationalId = document.getElementById("txtNationalId").value.trim();
    var nationalIdError = document.getElementById("errNationalId");
    var nationalIdPattern = /^(0[1-9]|1[0-4])[0-9]{9}$/;

    if (nationalId === "") {
        nationalIdError.innerText = "الرقم الوطني إلزامي الإدخال.";
        nationalIdError.style.display = "block";
        isValid = false;
    } else if (!nationalIdPattern.test(nationalId)) {
        nationalIdError.innerText = "الرقم الوطني يجب أن يتكون من 11 رقماً ويبدأ برمز محافظة صحيح (01 إلى 14).";
        nationalIdError.style.display = "block";
        isValid = false;
    } else {
        nationalIdError.style.display = "none";
    }

    // 3. التحقق من تاريخ بداية التأجير (إلزامي الإدخال)
    var startDateVal = document.getElementById("txtStartDate").value;
    var startDateError = document.getElementById("errStartDate");

    if (startDateVal === "") {
        startDateError.innerText = "تاريخ بداية التأجير إلزامي.";
        startDateError.style.display = "block";
        isValid = false;
    } else {
        startDateError.style.display = "none";
    }

    // 4. التحقق من تاريخ نهاية التأجير (إلزامي ويجب أن يكون لاحقاً للبداية)
    var endDateVal = document.getElementById("txtEndDate").value;
    var endDateError = document.getElementById("errEndDate");

    if (endDateVal === "") {
        endDateError.innerText = "تاريخ نهاية التأجير إلزامي.";
        endDateError.style.display = "block";
        isValid = false;
    } else if (startDateVal !== "") {
        var startD = new Date(startDateVal);
        var endD = new Date(endDateVal);

        if (endD <= startD) {
            endDateError.innerText = "تاريخ نهاية التأجير يجب أن يكون لاحقاً تماماً لتاريخ البداية.";
            endDateError.style.display = "block";
            isValid = false;
        } else {
            endDateError.style.display = "none";
        }
    } else {
        endDateError.style.display = "none";
    }

    // 5. التحقق من رقم الموبايل (بطاقتي Syriatel و MTN) - اختياري، ويفحص إن أدخل
    var mobile = document.getElementById("txtMobile").value.trim();
    var mobileError = document.getElementById("errMobile");
    var mobilePattern = /^09(3|4|5|6|8|9)[0-9]{7}$/;

    if (mobile !== "") {
        if (!mobilePattern.test(mobile)) {
            mobileError.innerText = "رقم الموبايل يجب أن يتألف من 10 أرقام ويبدأ بـ 09 لشبكتي Syriatel أو MTN (مثال: 0933112233).";
            mobileError.style.display = "block";
            isValid = false;
        } else {
            mobileError.style.display = "none";
        }
    } else {
        mobileError.style.display = "none";
    }

    // 6. التحقق من البريد الإلكتروني - اختياري، ويفحص إن أدخل
    var email = document.getElementById("txtEmail").value.trim();
    var emailError = document.getElementById("errEmail");
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email !== "") {
        if (!emailPattern.test(email)) {
            emailError.innerText = "صيغة البريد الإلكتروني غير صحيحة (مثال: user@svu-rental.sy).";
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }
    } else {
        emailError.style.display = "none";
    }

    // إيقاف التنفيذ عند وجود خطأ
    if (!isValid) {
        return false;
    }

    // ----------------------------------------------------------------------
    // الحسابات المالية (عدد الأيام، التكلفة، الخصم 5% إن تجاوزت 10 أيام)
    // ----------------------------------------------------------------------
    var dStart = new Date(startDateVal);
    var dEnd = new Date(endDateVal);
    var diffDays = Math.ceil(Math.abs(dEnd.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24));

    var totalBeforeDiscount = 0;
    var rowsHtml = "";

    selectedCheckboxes.each(function () {
        var code = $(this).attr("data-code");
        var name = $(this).attr("data-name");
        var price = parseInt($(this).attr("data-price"), 10);
        var subTotal = price * diffDays;
        totalBeforeDiscount += subTotal;

        rowsHtml += "<tr>" +
            "<td><strong>" + code + "</strong></td>" +
            "<td>" + name + "</td>" +
            "<td>" + price.toLocaleString() + " ل.س</td>" +
            "<td>" + diffDays + " أيام</td>" +
            "<td><strong>" + subTotal.toLocaleString() + " ل.س</strong></td>" +
            "</tr>";
    });

    var discountPercent = 0;
    var discountAmount = 0;

    if (diffDays > 10) {
        discountPercent = 5;
        discountAmount = totalBeforeDiscount * 0.05;
    }

    var finalAmount = totalBeforeDiscount - discountAmount;

    // بناء واجهة الإيصال الإلكتروني
    var modalContent = "" +
        "<p><strong>مقدم الطلب:</strong> " + (fullName !== "" ? fullName : "زبون محترم") + "</p>" +
        "<p><strong>الرقم الوطني:</strong> " + nationalId + "</p>" +
        "<p><strong>فترة الحجز:</strong> من " + startDateVal + " إلى " + endDateVal + " (المدة الإجمالية: <strong>" + diffDays + " يوم</strong>)</p>" +
        "<table class='receipt-table'>" +
        "<thead>" +
        "<tr>" +
        "<th>الرمز</th>" +
        "<th>الموديل</th>" +
        "<th>الأجرة اليومية</th>" +
        "<th>الأيام</th>" +
        "<th>المجموع الفرعي</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        rowsHtml +
        "</tbody>" +
        "</table>" +
        "<p style='font-size: 15px;'><strong>المجموع الإجمالي قبل الخصم:</strong> " + totalBeforeDiscount.toLocaleString() + " ل.س</p>";

    if (discountPercent > 0) {
        modalContent += "<div class='discount-banner'>🎉 تهانينا! تم منحك خصم " + discountPercent + "% لتجاوز مدة الحجز 10 أيام (وفرت: " + discountAmount.toLocaleString() + " ل.س).</div>";
    } else {
        modalContent += "<p class='field-help'>ملاحظة: لم يطبق خصم 5% (يطبق فقط عند تجاوز مدة التأجير 10 أيام).</p>";
    }

    modalContent += "<div class='final-total-box'>المبلغ الإجمالي النهائي للدفع: " + finalAmount.toLocaleString() + " ل.س</div>";

    // عرض النافذة
    document.getElementById("modalBodyContent").innerHTML = modalContent;
    $("#resultModal").fadeIn(350);

    return false;
}


// --------------------------------------------------------------------------
// [السؤال 1.5]: منطق المساعد الذكي لاختيار السيارات (AI Recommendation)
// --------------------------------------------------------------------------
function runAIAssistant(event) {
    if (event) event.preventDefault();

    var purpose = document.getElementById("selPurpose").value;
    var passengers = parseInt(document.getElementById("numPassengers").value, 10);
    var budget = parseInt(document.getElementById("numBudget").value, 10);

    var carName = "";
    var carCode = "";
    var rationale = "";

    if (purpose === "business" || budget >= 100) {
        carName = "Mercedes C200 (موديل 2024)";
        carCode = "CR-005";
        rationale = "تم ترشيح هذه السيارة لتلائم المناسبات الرسمية وقطاع الأعمال والميزانيات المرتفعة، مع توفير أقصى درجات الفخامة والمظهر الأنيق والراحة الاستثنائية.";
    } else if (purpose === "family" || passengers > 4) {
        carName = "Kia Sportage SUV (موديل 2022)";
        carCode = "CR-002";
        rationale = "تم ترشيح هذه السيارة لأنها توفر مقصورة فسيحة تتسع لأكثر من 4 ركاب مع حقائب السفر، ومزودة بنظام دفع رباعي ملائم للتنقل والسفر بين المحافظات.";
    } else if (budget < 40) {
        carName = "Chevrolet Spark (موديل 2021)";
        carCode = "CR-004";
        rationale = "تم ترشيحها لتلائم الميزانية المحدودة وتوفر استهلاكاً اقتصادياً ممتازاً للوقود وسهولة ركن عالية داخل شوارع المدينة المزدحمة.";
    } else {
        carName = "Toyota Corolla / Hyundai Elantra";
        carCode = "CR-001 / CR-003";
        rationale = "تم ترشيحها كخيار عملي واقتصادي متوازن يجمع بين الراحة، الكفاءة، والسعر المناسب للمشاوير اليومية داخل وخارج المدينة.";
    }

    document.getElementById("aiCarTitle").innerText = carName + " [" + carCode + "]";
    document.getElementById("aiCarReason").innerText = rationale;

    $("#aiAssistantForm").slideUp(250);
    $("#aiResultBox").slideDown(350);

    return false;
}

function resetAIAssistant() {
    $("#aiResultBox").slideUp(250);
    $("#aiAssistantForm").slideDown(350);
}
