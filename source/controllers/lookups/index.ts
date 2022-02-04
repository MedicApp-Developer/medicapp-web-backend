import Gender from '../../models/lookups/gender'
import mongoose from 'mongoose'
import logging from '../../config/logging'
import Country from '../../models/lookups/country'
import Language from '../../models/lookups/language'

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	poolSize: 50,
	autoIndex: false,
	retryWrites: false,
	useFindAndModify: false, useCreateIndex: true
}

const MONGO = {
	host: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority",
	username: "superuser",
	password: "supersecretpasswords",
	options: MONGO_OPTIONS,
	url: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority"
}

const gender = [
	{ name_en: "Male", name_ar: "ذكر" },
	{ name_en: "Female", name_ar: "أنثى" },
	{ name_en: "Other", name_ar: "ثان" }
]

const countryList = [
	{ name_en: "Afghanistan", name_ar: "أفغانستان" },
	{ name_en: "Albania", name_ar: "ألبانيا" },
	{ name_en: "Algeria", name_ar: "الجزائر" },
	{ name_en: "American Samoa", name_ar: "ساموا الأمريكية" },
	{ name_en: "Andorra", name_ar: "أندورا" },
	{ name_en: "Angola", name_ar: "أنغولا" },
	{ name_en: "Anguilla", name_ar: "أنغيلا" },
	{ name_en: "Antarctica", name_ar: "أنتاركتيكا" },
	{ name_en: "Antigua and Barbuda", name_ar: "أنتيغوا وبربودا" },
	{ name_en: "Argentina", name_ar: "الأرجنتين" },
	{ name_en: "Armenia", name_ar: "أرمينيا" },
	{ name_en: "Aruba", name_ar: "أروبا" },
	{ name_en: "Australia", name_ar: "أستراليا" },
	{ name_en: "Austria", name_ar: "النمسا" },
	{ name_en: "Azerbaijan", name_ar: "أذربيجان" },
	{ name_en: "Bahamas", name_ar: "جزر البهاما" },
	{ name_en: "Bahrain", name_ar: "البحرين" },
	{ name_en: "Bangladesh", name_ar: "بنغلاديش" },
	{ name_en: "Barbados", name_ar: "باربادوس" },
	{ name_en: "Belarus", name_ar: "بيلاروسيا" },
	{ name_en: "Belgium", name_ar: "بلجيكا" },
	{ name_en: "Belize", name_ar: "بليز" },
	{ name_en: "Benin", name_ar: "بنين" },
	{ name_en: "Bermuda", name_ar: "برمودا" },
	{ name_en: "Bhutan", name_ar: "بوتان" },
	{ name_en: "Bolivia (Plurinational State of)", name_ar: "بوليفيا(دولة - المتعددة القوميات)" },
	{ name_en: "Bonaire, Sint Eustatius and Saba", name_ar: "بونير وسانت يوستاتيوس وسابا" },
	{ name_en: "Bosnia and Herzegovina", name_ar: "البوسنة والهرسك" },
	{ name_en: "Botswana", name_ar: "بوتسوانا" },
	{ name_en: "Bouvet Island", name_ar: "جزيرة بوفيت" },
	{ name_en: "Brazil", name_ar: "البرازيل" },
	{ name_en: "British Indian Ocean Territory", name_ar: "إقليم المحيط الهندي البريطاني" },
	{ name_en: "Brunei Darussalam", name_ar: "بروناي دار السلام " },
	{ name_en: "Bulgaria", name_ar: "بلغاريا" },
	{ name_en: "Burkina Faso", name_ar: "بوركينا فاسو" },
	{ name_en: "Burundi", name_ar: "بوروندي" },
	{ name_en: "Cabo Verde", name_ar: "كابو فيردي" },
	{ name_en: "Cambodia", name_ar: "كمبوديا" },
	{ name_en: "Cameroon", name_ar: "الكاميرون" },
	{ name_en: "Canada", name_ar: "كندا" },
	{ name_en: "Cayman Islands", name_ar: "جزر كايمان" },
	{ name_en: "Central African Republic", name_ar: "جمهورية إفريقيا الوسطى" },
	{ name_en: "Chad", name_ar: "تشاد" },
	{ name_en: "Chile", name_ar: "تشيلي" },
	{ name_en: "China", name_ar: "الصين" },
	{ name_en: "Christmas Island", name_ar: "جزيرة الكريسماس" },
	{ name_en: "Cocos (Keeling) Islands", name_ar: "جزر كوكوس(كيلينغ)" },
	{ name_en: "Colombia", name_ar: "كولومبيا" },
	{ name_en: "Comoros", name_ar: "جزر القمر" },
	{ name_en: "Congo (the Democratic Republic of the)", name_ar: "الكونغو(جمهورية الديموقراطية)" },
	{ name_en: "Congo", name_ar: "الكونغو" },
	{ name_en: "Cook Islands", name_ar: "جزر كوك" },
	{ name_en: "Costa Rica", name_ar: "كوستاريكا" },
	{ name_en: "Croatia", name_ar: "كرواتيا" },
	{ name_en: "Cuba", name_ar: "كوبا" },
	{ name_en: "Curaçao", name_ar: "كوراساو" },
	{ name_en: "Cyprus", name_ar: "قبرص" },
	{ name_en: "Czechia", name_ar: "التشيك" },
	{ name_en: "Côte d'Ivoire", name_ar: "كوت ديفوار" },
	{ name_en: "Denmark", name_ar: "الدنمارك" },
	{ name_en: "Djibouti", name_ar: "جيبوتي" },
	{ name_en: "Dominica", name_ar: "دومينيكا" },
	{ name_en: "Dominican Republic", name_ar: "جمهورية الدومينيكان" },
	{ name_en: "Ecuador", name_ar: "الإكوادور" },
	{ name_en: "Egypt", name_ar: "مصر" },
	{ name_en: "El Salvador", name_ar: "السلفادور" },
	{ name_en: "Equatorial Guinea", name_ar: "غينيا الاستوائية" },
	{ name_en: "Eritrea", name_ar: "إريتريا" },
	{ name_en: "Estonia", name_ar: "إستونيا" },
	{ name_en: "Eswatini", name_ar: "إيسواتيني" },
	{ name_en: "Ethiopia", name_ar: "إثيوبيا" },
	{ name_en: "Falkland Islands [Malvinas]", name_ar: "جزر فوكلاند [مالفيناس]" },
	{ name_en: "Faroe Islands", name_ar: "جزر فارو" },
	{ name_en: "Fiji", name_ar: "فيجي" },
	{ name_en: "Finland", name_ar: "فنلندا" },
	{ name_en: "France", name_ar: "فرنسا" },
	{ name_en: "French Guiana", name_ar: "غيانا الفرنسية" },
	{ name_en: "French Polynesia", name_ar: "بولينيزيا الفرنسية" },
	{ name_en: "French Southern Territories", name_ar: "المناطق الجنوبية لفرنسا" },
	{ name_en: "Gambia", name_ar: "غامبيا" },
	{ name_en: "Gabon", name_ar: "الجابون" },
	{ name_en: "Georgia", name_ar: "جورجيا" },
	{ name_en: "Germany", name_ar: "ألمانيا" },
	{ name_en: "Ghana", name_ar: "غانا" },
	{ name_en: "Gibraltar", name_ar: "جبل طارق" },
	{ name_en: "Greece", name_ar: "اليونان" },
	{ name_en: "Greenland", name_ar: "جرينلاند" },
	{ name_en: "Grenada", name_ar: "غرينادا" },
	{ name_en: "Guadeloupe", name_ar: "جوادلوب" },
	{ name_en: "Guam", name_ar: "غوام" },
	{ name_en: "Guatemala", name_ar: "جواتيمالا" },
	{ name_en: "Guernsey", name_ar: "غيرنسي" },
	{ name_en: "Guinea", name_ar: "غينيا" },
	{ name_en: "Guinea-Bissau", name_ar: "غينيا بيساو" },
	{ name_en: "Guyana", name_ar: "غيانا" },
	{ name_en: "Haiti", name_ar: "هايتي" },
	{ name_en: "Heard Island and McDonald Islands", name_ar: "قلب الجزيرة وجزر ماكدونالز" },
	{ name_en: "Holy See", name_ar: "الكرسي الرسولي" },
	{ name_en: "Honduras", name_ar: "هندوراس" },
	{ name_en: "Hong Kong", name_ar: "هونغ كونغ" },
	{ name_en: "Hungary", name_ar: "هنغاريا" },
	{ name_en: "Iceland", name_ar: "أيسلندا" },
	{ name_en: "India", name_ar: "الهند" },
	{ name_en: "Indonesia", name_ar: "إندونيسيا" },
	{ name_en: "Iran (Islamic Republic of)", name_ar: "إيران (جمهورية - الإسلامية)" },
	{ name_en: "Ireland", name_ar: "أيرلندا" },
	{ name_en: "Iraq", name_ar: "العراق" },
	{ name_en: "Isle of Man", name_ar: "جزيرة آيل أوف مان" },
	{ name_en: "Israel", name_ar: "إسرائيل" },
	{ name_en: "Italy", name_ar: "إيطاليا" },
	{ name_en: "Jamaica", name_ar: "جامايكا" },
	{ name_en: "Japan", name_ar: "اليابان" },
	{ name_en: "Jersey", name_ar: "جيرسي" },
	{ name_en: "Jordan", name_ar: "الأردن" },
	{ name_en: "Kazakhstan", name_ar: "كازاخستان" },
	{ name_en: "Kenya", name_ar: "كينيا" },
	{ name_en: "Kiribati", name_ar: "كيريباتي" },
	{ name_en: "Korea (the Democratic People)", name_ar: "كوريا (الشعب الديمقراطي)" },
	{ name_en: "Korea (the Republic of)", name_ar: "كوريا (جمهورية)" },
	{ name_en: "Kuwait", name_ar: "الكويت" },
	{ name_en: "Kyrgyzstan", name_ar: "قيرغيزستان" },
	{ name_en: "Lao People", name_ar: "شعب لاو" },
	{ name_en: "Latvia", name_ar: "لاتفيا" },
	{ name_en: "Lebanon", name_ar: "لبنان" },
	{ name_en: "Lesotho", name_ar: "ليسوتو" },
	{ name_en: "Liberia", name_ar: "ليبيريا" },
	{ name_en: "Libya", name_ar: "ليبيا" },
	{ name_en: "Liechtenstein", name_ar: "ليختنشتاين" },
	{ name_en: "Lithuania", name_ar: "ليتوانيا" },
	{ name_en: "Luxembourg", name_ar: "لوكسمبورغ" },
	{ name_en: "Macao", name_ar: "ماكاو" },
	{ name_en: "Madagascar", name_ar: "مدغشقر" },
	{ name_en: "Malawi", name_ar: "ملاوي" },
	{ name_en: "Malaysia", name_ar: "ماليزيا" },
	{ name_en: "Maldives", name_ar: "جزر المالديف" },
	{ name_en: "Mali", name_ar: "مالي" },
	{ name_en: "Malta", name_ar: "مالطا" },
	{ name_en: "Marshall Islands", name_ar: "جزر مارشال" },
	{ name_en: "Martinique", name_ar: "مارتينيك" },
	{ name_en: "Mauritania", name_ar: "موريتانيا" },
	{ name_en: "Mauritius", name_ar: "موريشيوس" },
	{ name_en: "Mayotte", name_ar: "مايوت" },
	{ name_en: "Mexico", name_ar: "المكسيك" },
	{ name_en: "Micronesia (Federated States of)", name_ar: "ميكرونيزيا (ولايات - الموحدة)" },
	{ name_en: "Moldova (the Republic of)", name_ar: "مولدوفا (جمهورية)" },
	{ name_en: "Monaco", name_ar: "موناكو" },
	{ name_en: "Mongolia", name_ar: "منغوليا" },
	{ name_en: "Montenegro", name_ar: "الجبل الأسود" },
	{ name_en: "Montserrat", name_ar: "مونتسيرات" },
	{ name_en: "Morocco", name_ar: "المغرب" },
	{ name_en: "Mozambique", name_ar: "موزمبيق" },
	{ name_en: "Myanmar", name_ar: "ميانمار" },
	{ name_en: "Namibia", name_ar: "ناميبيا" },
	{ name_en: "Nauru", name_ar: "ناورو" },
	{ name_en: "Nepal", name_ar: "نيبال" },
	{ name_en: "Netherlands", name_ar: "هولندا" },
	{ name_en: "New Caledonia", name_ar: "كاليدونيا الجديدة" },
	{ name_en: "New Zealand", name_ar: "نيوزيلندا" },
	{ name_en: "Nicaragua", name_ar: "نيكاراغوا" },
	{ name_en: "Niger", name_ar: "النيجر" },
	{ name_en: "Nigeria", name_ar: "نيجيريا" },
	{ name_en: "Niue", name_ar: "نيوي" },
	{ name_en: "Norfolk Island", name_ar: "جزيرة نورفولك" },
	{ name_en: "Northern Mariana Islands", name_ar: "جزر مريانا الشمالية" },
	{ name_en: "Norway", name_ar: "النرويج" },
	{ name_en: "Oman", name_ar: "عمان" },
	{ name_en: "Pakistan", name_ar: "باكستان" },
	{ name_en: "Palau", name_ar: "بالاو" },
	{ name_en: "Palestine, State of", name_ar: "فلسطين ، دولة" },
	{ name_en: "Panama", name_ar: "بنما" },
	{ name_en: "Papua New Guinea", name_ar: "بابوا غينيا الجديدة" },
	{ name_en: "Paraguay", name_ar: "باراجواي" },
	{ name_en: "Peru", name_ar: "بيرو" },
	{ name_en: "Philippines", name_ar: "الفلبين" },
	{ name_en: "Pitcairn", name_ar: "بيتكيرن" },
	{ name_en: "Poland", name_ar: "بولندا" },
	{ name_en: "Portugal", name_ar: "البرتغال" },
	{ name_en: "Puerto Rico", name_ar: "بورتوريكو" },
	{ name_en: "Qatar", name_ar: "قطر" },
	{ name_en: "Republic of North Macedonia", name_ar: "جمهورية مقدونيا الشمالية" },
	{ name_en: "Romania", name_ar: "رومانيا" },
	{ name_en: "Russian Federation", name_ar: "الاتحاد الروسي" },
	{ name_en: "Rwanda", name_ar: "رواندا" },
	{ name_en: "Réunion", name_ar: "جمع شمل" },
	{ name_en: "Saint Barthélemy", name_ar: "القديس بارتليمي" },
	{ name_en: "Saint Helena, Ascension and Tristan da Cunha", name_ar: "سانت هيلانة وأسنسيون وتريستان دا كونها" },
	{ name_en: "Saint Kitts and Nevis", name_ar: "سانت كيتس ونيفيس" },
	{ name_en: "Saint Lucia", name_ar: "سانت لوسيا" },
	{ name_en: "Saint Martin (French part)", name_ar: "سانت مارتن (الجزء الفرنسي)" },
	{ name_en: "Saint Pierre and Miquelon", name_ar: "سان بيير وميكلون" },
	{ name_en: "Saint Vincent and the Grenadines", name_ar: "سانت فنسنت وجزر غرينادين" },
	{ name_en: "Samoa", name_ar: "ساموا" },
	{ name_en: "San Marino", name_ar: "سان مارينو" },
	{ name_en: "Sao Tome and Principe", name_ar: "ساو تومي وبرينسيبي" },
	{ name_en: "Saudi Arabia", name_ar: "المملكة العربية السعودية" },
	{ name_en: "Senegal", name_ar: "السنغال" },
	{ name_en: "Serbia", name_ar: "صربيا" },
	{ name_en: "Seychelles", name_ar: "سيشل" },
	{ name_en: "Sierra Leone", name_ar: "سيراليون" },
	{ name_en: "Singapore", name_ar: "سنغافورة" },
	{ name_en: "Sint Maarten (Dutch part)", name_ar: "سينت مارتن (الجزء الهولندي)" },
	{ name_en: "Slovakia", name_ar: "سلوفاكيا" },
	{ name_en: "Slovenia", name_ar: "سلوفينيا" },
	{ name_en: "Solomon Islands", name_ar: "جزر سليمان" },
	{ name_en: "Somalia", name_ar: "الصومال" },
	{ name_en: "South Africa", name_ar: "جنوب إفريقيا" },
	{ name_en: "South Georgia and the South Sandwich Islands", name_ar: "جورجيا الجنوبية وجزر ساندويتش الجنوبية" },
	{ name_en: "South Sudan", name_ar: "جنوب السودان" },
	{ name_en: "Spain", name_ar: "أسبانيا" },
	{ name_en: "Sri Lanka", name_ar: "سريلانكا" },
	{ name_en: "Sudan", name_ar: "السودان" },
	{ name_en: "Suriname", name_ar: "سورينام" },
	{ name_en: "Svalbard and Jan Mayen", name_ar: "سفالبارد وجان ماين" },
	{ name_en: "Sweden", name_ar: "السويد" },
	{ name_en: "Switzerland", name_ar: "سويسرا" },
	{ name_en: "Syrian Arab Republic", name_ar: "الجمهورية العربية السورية" },
	{ name_en: "Taiwan (Province of China)", name_ar: "تايوان (مقاطعة الصين)" },
	{ name_en: "Tajikistan", name_ar: "طاجيكستان" },
	{ name_en: "Tanzania, United Republic of", name_ar: "جمهورية تنزانيا المتحدة" },
	{ name_en: "Thailand", name_ar: "تايلاند" },
	{ name_en: "Timor-Leste", name_ar: "تيمور الشرقية" },
	{ name_en: "Togo", name_ar: "توغو" },
	{ name_en: "Tokelau", name_ar: "توكيلاو" },
	{ name_en: "Tonga", name_ar: "تونجا" },
	{ name_en: "Trinidad and Tobago", name_ar: "ترينيداد وتوباغو" },
	{ name_en: "Tunisia", name_ar: "تونس" },
	{ name_en: "Turkey", name_ar: "تركيا" },
	{ name_en: "Turkmenistan", name_ar: "تركمانستان" },
	{ name_en: "Turks and Caicos Islands", name_ar: "جزر تركس وكايكوس" },
	{ name_en: "Tuvalu", name_ar: "توفالو" },
	{ name_en: "Uganda", name_ar: "أوغندا" },
	{ name_en: "Ukraine", name_ar: "أوكرانيا" },
	{ name_en: "United Arab Emirates", name_ar: "الإمارات العربية المتحدة" },
	{ name_en: "United Kingdom of Great Britain and Northern Ireland", name_ar: "المملكة المتحدة لبريطانيا العظمى وأيرلندا الشمالية" },
	{ name_en: "United States Minor Outlying Islands", name_ar: "جزر الولايات المتحدة البعيدة الصغرى" },
	{ name_en: "United States of America", name_ar: "الولايات المتحدة الأمريكية" },
	{ name_en: "Uruguay", name_ar: "أوروغواي" },
	{ name_en: "Uzbekistan", name_ar: "أوزبكستان" },
	{ name_en: "Vanuatu", name_ar: "فانواتو" },
	{ name_en: "Venezuela (Bolivarian Republic of)", name_ar: "فنزويلا (جمهورية البوليفارية)" },
	{ name_en: "Viet Nam", name_ar: "فيتنام" },
	{ name_en: "Virgin Islands (British)", name_ar: "جزر العذراء (البريطانية)" },
	{ name_en: "Virgin Islands (U.S.)", name_ar: "جزر فيرجن (الولايات المتحدة)" },
	{ name_en: "Wallis and Futuna", name_ar: "واليس وفوتونا" },
	{ name_en: "Western Sahara", name_ar: "الصحراء الغربية" },
	{ name_en: "Yemen", name_ar: "اليمن" },
	{ name_en: "Zambia", name_ar: "زامبيا" },
	{ name_en: "Zimbabwe", name_ar: "زمبابوي" },
	{ name_en: "Åland Islands", name_ar: "جزر آلاند" }
]

const languagesList = [
	{ name_en: 'Abkhazian', name_ar: "أبخازية" },
	{ name_en: 'Afar', name_ar: "عفار" },
	{ name_en: 'Afrikaans', name_ar: "الأفريقانية" },
	{ name_en: 'Akan', name_ar: "أكان" },
	{ name_en: 'Albanian', name_ar: "ألباني" },
	{ name_en: 'Amharic', name_ar: "أمهرية" },
	{ name_en: 'Arabic', name_ar: "عربى" },
	{ name_en: 'Aragonese', name_ar: "أراغون" },
	{ name_en: 'Armenian', name_ar: "أرميني" },
	{ name_en: 'Assamese', name_ar: "الأسامية" },
	{ name_en: 'Avaric', name_ar: "أفاريك" },
	{ name_en: 'Avestan', name_ar: "افستان" },
	{ name_en: 'Aymara', name_ar: "أيمارا" },
	{ name_en: 'Azerbaijani', name_ar: "الأذربيجانية" },
	{ name_en: 'Bambara', name_ar: "بامبارا" },
	{ name_en: 'Bashkir', name_ar: "بشكير" },
	{ name_en: 'Basque', name_ar: "الباسك" },
	{ name_en: 'Belarusian', name_ar: "بيلاروسية" },
	{ name_en: 'Bengali', name_ar: "بنغالي" },
	{ name_en: 'Bihari languages', name_ar: "اللغات البيهارية" },
	{ name_en: 'Bislama', name_ar: "بيسلاما" },
	{ name_en: 'Bosnian', name_ar: "بوسني" },
	{ name_en: 'Breton', name_ar: "بريتون" },
	{ name_en: 'Bulgarian', name_ar: "بلغاري" },
	{ name_en: 'Burmese', name_ar: "بورمي" },
	{ name_en: 'Catalan, Valencian', name_ar: "الكتالونية ، بلنسية" },
	{ name_en: 'Central Khmer', name_ar: "الخمير الوسطى" },
	{ name_en: 'Chamorro', name_ar: "شامورو" },
	{ name_en: 'Chechen', name_ar: "الشيشان" },
	{ name_en: 'Chichewa, Chewa, Nyanja', name_ar: "شيشيوا ، شيوا ، نيانجا" },
	{ name_en: 'Chinese', name_ar: "صينى" },
	{ name_en: 'Church Slavonic, Old Bulgarian, Old Church Slavonic', name_ar: "الكنيسة السلافية ، البلغارية القديمة ، الكنيسة السلافية القديمة" },
	{ name_en: 'Chuvash', name_ar: "تشوفاش" },
	{ name_en: 'Cornish', name_ar: "كورنيش" },
	{ name_en: 'Corsican', name_ar: "كورسيكان" },
	{ name_en: 'Cree', name_ar: "كري" },
	{ name_en: 'Croatian', name_ar: "كرواتي" },
	{ name_en: 'Czech', name_ar: "تشيكي" },
	{ name_en: 'Danish', name_ar: "دانماركي" },
	{ name_en: 'Divehi, Dhivehi, Maldivian', name_ar: "ديفيهي ، ديفيهي ، المالديف" },
	{ name_en: 'Dutch, Flemish', name_ar: "الهولندية ، الفلمنكية" },
	{ name_en: 'Dzongkha', name_ar: "دزونكا " },
	{ name_en: 'English', name_ar: "إنجليزي" },
	{ name_en: 'Esperanto', name_ar: "اسبرانتو" },
	{ name_en: 'Estonian', name_ar: "الإستونية" },
	{ name_en: 'Ewe', name_ar: "إيوي" },
	{ name_en: 'Faroese', name_ar: "الفارويز" },
	{ name_en: 'Fijian', name_ar: "فيجي" },
	{ name_en: 'Finnish', name_ar: "فنلندية" },
	{ name_en: 'French', name_ar: "فرنسي" },
	{ name_en: 'Fulah', name_ar: "فولا" },
	{ name_en: 'Gaelic, Scottish Gaelic', name_ar: "الغيلية الاسكتلندية" },
	{ name_en: 'Galician', name_ar: "الجاليكية" },
	{ name_en: 'Ganda', name_ar: "غاندا" },
	{ name_en: 'Georgian', name_ar: "الجورجية" },
	{ name_en: 'German', name_ar: "ألمانية" },
	{ name_en: 'Gikuyu, Kikuyu', name_ar: "جيكويو ، كيكويو" },
	{ name_en: 'Greek (Modern)', name_ar: "يوناني (حديث)" },
	{ name_en: 'Greenlandic, Kalaallisut', name_ar: "جرينلاندك ، كالاليسوت" },
	{ name_en: 'Guarani', name_ar: "الجواراني" },
	{ name_en: 'Gujarati', name_ar: "الغوجاراتية" },
	{ name_en: 'Haitian, Haitian Creole', name_ar: "الكريولية الهايتية" },
	{ name_en: 'Hausa', name_ar: "الهوسا" },
	{ name_en: 'Hebrew', name_ar: "عبري" },
	{ name_en: 'Herero', name_ar: "هيريرو" },
	{ name_en: 'Hindi', name_ar: "الهندية" },
	{ name_en: 'Hiri Motu', name_ar: "هيري موتو" },
	{ name_en: 'Hungarian', name_ar: "مجري" },
	{ name_en: 'Icelandic', name_ar: "آيسلندي" },
	{ name_en: 'Ido', name_ar: "أفعل" },
	{ name_en: 'Igbo', name_ar: "إيغبو" },
	{ name_en: 'Indonesian', name_ar: "الأندونيسية" },
	{ name_en: 'Interlingua (International Auxiliary Language Association)', name_ar: "إنترلينجوا (الرابطة الدولية للغات المساعدة)" },
	{ name_en: 'Interlingue', name_ar: "إنترلينج" },
	{ name_en: 'Inuktitut', name_ar: "إينوكتيتوت" },
	{ name_en: 'Inupiaq', name_ar: "كتف" },
	{ name_en: 'Irish', name_ar: "أيرلندي" },
	{ name_en: 'Italian', name_ar: "إيطالي" },
	{ name_en: 'Japanese', name_ar: "اليابانية" },
	{ name_en: 'Javanese', name_ar: "جافانيز" },
	{ name_en: 'Kannada', name_ar: "الكانادا" },
	{ name_en: 'Kanuri', name_ar: "كانوري" },
	{ name_en: 'Kashmiri', name_ar: "كشميري" },
	{ name_en: 'Kazakh', name_ar: "الكازاخستانية" },
	{ name_en: 'Kinyarwanda', name_ar: "كينيارواندا" },
	{ name_en: 'Komi', name_ar: "كومي" },
	{ name_en: 'Kongo', name_ar: "كونغو" },
	{ name_en: 'Korean', name_ar: "الكورية" },
	{ name_en: 'Kwanyama, Kuanyama', name_ar: "كوانياما ، كوانياما" },
	{ name_en: 'Kurdish', name_ar: "كردي" },
	{ name_en: 'Kyrgyz', name_ar: "قيرغيزستان" },
	{ name_en: 'Lao', name_ar: "لاو" },
	{ name_en: 'Latin', name_ar: "لاتينية" },
	{ name_en: 'Latvian', name_ar: "لاتفية" },
	{ name_en: 'Letzeburgesch, Luxembourgish', name_ar: "اللوكسمبورغية" },
	{ name_en: 'Limburgish, Limburgan, Limburger', name_ar: "ليمبرغر" },
	{ name_en: 'Lingala', name_ar: "اللينغالا" },
	{ name_en: 'Lithuanian', name_ar: "الليتوانية" },
	{ name_en: 'Luba-Katanga', name_ar: "لوبا كاتانغا" },
	{ name_en: 'Macedonian', name_ar: "مقدونية" },
	{ name_en: 'Malagasy', name_ar: "مدغشقر" },
	{ name_en: 'Malay', name_ar: "الملايو" },
	{ name_en: 'Malayalam', name_ar: "المالايالامية" },
	{ name_en: 'Maltese', name_ar: "مالطية" },
	{ name_en: 'Manx', name_ar: "مانكس" },
	{ name_en: 'Maori', name_ar: "الماورية" },
	{ name_en: 'Marathi', name_ar: "المهاراتية" },
	{ name_en: 'Marshallese', name_ar: "مارشال" },
	{ name_en: 'Moldovan, Moldavian, Romanian', name_ar: "مولدوفا ، مولدوفا ، روماني" },
	{ name_en: 'Mongolian', name_ar: "المنغولية" },
	{ name_en: 'Nauru', name_ar: "ناورو" },
	{ name_en: 'Navajo, Navaho', name_ar: "نافاجو ، نافاهو" },
	{ name_en: 'Northern Ndebele', name_ar: "نورثرن نديبيلي" },
	{ name_en: 'Ndonga', name_ar: "ندونغا" },
	{ name_en: 'Nepali', name_ar: "نيبالية" },
	{ name_en: 'Northern Sami', name_ar: "سامي الشمالية" },
	{ name_en: 'Norwegian', name_ar: "النرويجية" },
	{ name_en: 'Norwegian Bokmål', name_ar: "بوكمول النرويجي" },
	{ name_en: 'Norwegian Nynorsk', name_ar: "نينورسك النرويجي" },
	{ name_en: 'Nuosu, Sichuan Yi', name_ar: " سيتشوان يي" },
	{ name_en: 'Occitan (post 1500)', name_ar: "الأوكيتان (بعد 1500)" },
	{ name_en: 'Ojibwa', name_ar: "اوجيبوا" },
	{ name_en: 'Oriya', name_ar: "أورييا" },
	{ name_en: 'Oromo', name_ar: "أورومو" },
	{ name_en: 'Ossetian, Ossetic', name_ar: "الأوسيتيك" },
	{ name_en: 'Pali', name_ar: "بالي" },
	{ name_en: 'Panjabi, Punjabi', name_ar: "بنجابي ، بنجابي" },
	{ name_en: 'Pashto, Pushto', name_ar: "الباشتو ، الباشتو" },
	{ name_en: 'Persian', name_ar: "فارسي" },
	{ name_en: 'Polish', name_ar: "بولندي" },
	{ name_en: 'Portuguese', name_ar: "برتغالي" },
	{ name_en: 'Quechua', name_ar: "، كيتشوا" },
	{ name_en: 'Romansh', name_ar: "رومانش" },
	{ name_en: 'Rundi', name_ar: "روندي" },
	{ name_en: 'Russian', name_ar: "روسي" },
	{ name_en: 'Samoan', name_ar: "ساموا" },
	{ name_en: 'Sango', name_ar: "سانغو" },
	{ name_en: 'Sanskrit', name_ar: "السنسكريتية" },
	{ name_en: 'Sardinian', name_ar: "سردينيان" },
	{ name_en: 'Serbian', name_ar: "الصربية" },
	{ name_en: 'Shona', name_ar: "شونا" },
	{ name_en: 'Sindhi', name_ar: "السندية" },
	{ name_en: 'Sinhala, Sinhalese', name_ar: "السنهالية والسنهالية" },
	{ name_en: 'Slovak', name_ar: "السلوفاكية" },
	{ name_en: 'Slovenian', name_ar: "سلوفينية" },
	{ name_en: 'Somali', name_ar: "صومالي" },
	{ name_en: 'Sotho, Southern', name_ar: "سوتو الجنوبية" },
	{ name_en: 'South Ndebele', name_ar: "جنوب نديبيلي" },
	{ name_en: 'Spanish, Castilian', name_ar: "الإسبانية ، القشتالية" },
	{ name_en: 'Sundanese', name_ar: "السوندانيز" },
	{ name_en: 'Swahili', name_ar: "سواحيلية" },
	{ name_en: 'Swati', name_ar: "سواتي" },
	{ name_en: 'Swedish', name_ar: "سويدية" },
	{ name_en: 'Tagalog', name_ar: "تاجالوج" },
	{ name_en: 'Tahitian', name_ar: "تاهيتي" },
	{ name_en: 'Tajik', name_ar: "طاجيكي" },
	{ name_en: 'Tamil', name_ar: "التاميلية" },
	{ name_en: 'Tatar', name_ar: "تتر" },
	{ name_en: 'Telugu', name_ar: "التيلجو" },
	{ name_en: 'Thai', name_ar: "تايلاندي" },
	{ name_en: 'Tibetan', name_ar: "التبتية" },
	{ name_en: 'Tigrinya', name_ar: "التغرينية" },
	{ name_en: 'Tonga (Tonga Islands)', name_ar: "تونجا (جزر تونغا)" },
	{ name_en: 'Tsonga', name_ar: "تسونجا" },
	{ name_en: 'Tswana', name_ar: "تسوانا" },
	{ name_en: 'Turkish', name_ar: "التركية" },
	{ name_en: 'Turkmen', name_ar: "تركمان" },
	{ name_en: 'Twi', name_ar: "توي" },
	{ name_en: 'Uighur, Uyghur', name_ar: "الأويغور ، الأويغور" },
	{ name_en: 'Ukrainian', name_ar: "الأوكرانية" },
	{ name_en: 'Urdu', name_ar: 'الأردية' },
	{ name_en: 'Uzbek', name_ar: "أوزبكي" },
	{ name_en: 'Venda', name_ar: "فيندا" },
	{ name_en: 'Vietnamese', name_ar: "فيتنامي" },
	{ name_en: 'Volap_k', name_ar: "فولابوك" },
	{ name_en: 'Walloon', name_ar: "الوالون" },
	{ name_en: 'Welsh', name_ar: "الويلزية" },
	{ name_en: 'Western Frisian', name_ar: "فريزيان غربي" },
	{ name_en: 'Wolof', name_ar: "ولوف" },
	{ name_en: 'Xhosa', name_ar: 'خوسا' },
	{ name_en: 'Yiddish', name_ar: "اليديشية" },
	{ name_en: 'Yoruba', name_ar: "اليوروبا" },
	{ name_en: 'Zhuang, Chuang', name_ar: "تشوانغ" },
	{ name_en: 'Zulu', name_ar: "الزولو" }
]

const insertLookups = async () => {

	await mongoose.connect(MONGO.url, MONGO.options)

	console.log("Clearing the lookups first...")

	await Gender.deleteMany({})
	await Country.deleteMany({})
	await Language.deleteMany({})

	console.log("Inserting lookups")

	const options = { ordered: true }

	await Gender.insertMany(gender, options)
	//@ts-ignore
	console.log(`Genders were inserted`)

	await Country.insertMany(countryList, options)
	//@ts-ignore
	console.log("Countries were inserted")

	await Language.insertMany(languagesList, options)
	//@ts-ignore
	console.log("Languages were inserted")

	process.exit()

}

insertLookups()

// How to insert Lookups 
		// In the terminal, go to this directory first and then run following command
				// npx ts-node index.ts