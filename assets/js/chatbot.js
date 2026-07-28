/**
 * ABC Salon AI Assistant - Interactive Chatbot Engine
 * Features: Customer support, Beauty & Hair Solutions, Interactive Booking Flow, WhatsApp integration
 */

(function () {
    // Chatbot State
    const state = {
        isOpen: false,
        inBookingFlow: false,
        bookingDetails: {
            service: "Signature Haircut & Styling (₹999)",
            date: "",
            time: "11:30 AM",
            name: "",
            phone: "",
            notes: ""
        }
    };

    // Beauty & Service Knowledge Base
    const knowledgeBase = {
        hair: [
            "💇 **Hair Solutions & Styling at ABC**:\n• *Dry/Damaged Hair*: We recommend our Keratin & Organic Glossing treatment.\n• *Haircut & Styling*: Custom face-frame cuts starting at ₹999.\n• *Coloring*: Balayage, Highlights, and Ammonia-Free Organic Hair Colors from ₹4,999.\nWould you like to book a hair consultation session?"
        ],
        skin: [
            "✨ **Skincare & Facial Solutions**:\n• *Dull / Dehydrated Skin*: Gold Hydradermie Facial (₹2,999) for instant radiance.\n• *Acne & Cleansing*: Deep Detox Herbal Facial.\n• *Anti-Aging*: Collagen Boost & Firming Treatment.\nAll facials include a complimentary skin consultation!"
        ],
        nails: [
            "💅 **Nail Care & Spa Treatments**:\n• Luxury Gel Manicure & Spa (₹1,299)\n• Pedicure Aromatherapy (₹1,499)\n• Nail Art & Extensions starting from ₹1,999."
        ],
        bridal: [
            "👑 **Royal Bridal Makeup Suite**:\nOur signature bridal packages include HD/Airbrush Makeup, Hair Styling, Pre-Bridal Skin Treatments, and Saree Draping starting at ₹9,999. Customized packages available upon request!"
        ],
        hours: [
            "🕒 **ABC Salon Hours & Contact**:\n• Open Daily: 10:00 AM – 08:30 PM\n• Address: 123 Luxury Avenue, Suite 400\n• Phone: +91 98765 43210\nWalk-ins are welcome, but advance booking is recommended!"
        ],
        pricing: [
            "💰 **Popular Services & Pricing**:\n1. Signature Haircut & Styling - ₹999\n2. Gold Hydradermie Facial - ₹2,999\n3. Luxury Gel Manicure & Spa - ₹1,299\n4. Balayage & Organic Gloss - ₹4,999+\n5. Aromatherapy Body Detox - ₹3,499"
        ]
    };

    // DOM Elements
    let containerEl, triggerEl, windowEl, messagesEl, inputEl, sendBtnEl;

    // Initialize Widget
    function init() {
        createChatbotDOM();
        bindEvents();
        sendInitialGreeting();
    }

    // Inject HTML Structure into DOM
    function createChatbotDOM() {
        const wrap = document.createElement('div');
        wrap.id = 'abc-chatbot-container';
        wrap.innerHTML = `
            <!-- Floating Trigger -->
            <button id="abc-chat-trigger-btn" class="abc-chat-trigger" aria-label="Open ABC AI Assistant">
                <span class="material-symbols-outlined text-2xl">sparkles</span>
                <span class="font-medium text-xs uppercase tracking-wider hidden sm:inline">Chat with ABC</span>
                <div class="badge-pulse"></div>
            </button>

            <!-- Chat Window -->
            <div id="abc-chat-window-panel" class="abc-chat-window">
                <!-- Header -->
                <div class="abc-chat-header">
                    <div class="flex items-center gap-3">
                        <div class="abc-chat-avatar">
                            <span class="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <div>
                            <div class="font-bold text-sm text-on-surface flex items-center gap-1.5">
                                <span>ABC Assistant</span>
                                <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                            </div>
                            <div class="text-[10px] text-primary tracking-wide uppercase font-semibold">Salon & Beauty Concierge</div>
                        </div>
                    </div>
                    <button id="abc-chat-close-btn" class="text-on-surface-variant hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <!-- Messages area -->
                <div id="abc-chat-msg-area" class="abc-chat-messages"></div>

                <!-- Input area -->
                <form id="abc-chat-form" class="abc-chat-input-area">
                    <input id="abc-chat-input-field" type="text" placeholder="Ask ABC or type 'Book'..." class="abc-chat-input" autocomplete="off" />
                    <button type="submit" class="abc-chat-send-btn">
                        <span class="material-symbols-outlined text-lg">send</span>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(wrap);

        triggerEl = document.getElementById('abc-chat-trigger-btn');
        windowEl = document.getElementById('abc-chat-window-panel');
        messagesEl = document.getElementById('abc-chat-msg-area');
        inputEl = document.getElementById('abc-chat-input-field');
        sendBtnEl = document.querySelector('.abc-chat-send-btn');
    }

    // Bind Event Listeners
    function bindEvents() {
        triggerEl.addEventListener('click', toggleChat);
        document.getElementById('abc-chat-close-btn').addEventListener('click', toggleChat);

        document.getElementById('abc-chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const text = inputEl.value.trim();
            if (text) {
                handleUserMessage(text);
                inputEl.value = '';
            }
        });
    }

    // Toggle Chat Visibility
    function toggleChat() {
        state.isOpen = !state.isOpen;
        if (state.isOpen) {
            windowEl.classList.add('open');
            inputEl.focus();
        } else {
            windowEl.classList.remove('open');
        }
    }

    // Initial Welcome Message
    function sendInitialGreeting() {
        const welcomeText = "Hello! 👋 I am **ABC**, your personal beauty & luxury salon concierge.\n\nHow can I help you elevate your look today?";
        const chips = [
            { label: "📅 Book Appointment", action: "start_booking" },
            { label: "💇 Hair Solutions", action: "query_hair" },
            { label: "✨ Skincare Advice", action: "query_skin" },
            { label: "💰 Services & Prices", action: "query_pricing" },
            { label: "🕒 Hours & Location", action: "query_hours" }
        ];
        appendBotMessage(welcomeText, chips);
    }

    // Render User Message Bubble
    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'abc-msg abc-msg-user';
        msg.textContent = text;
        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    // Render Bot Message Bubble with Markdown Formatting
    function appendBotMessage(text, chips = []) {
        const msg = document.createElement('div');
        msg.className = 'abc-msg abc-msg-bot';
        
        // Convert simple markdown formatting (**bold**, *italic*, \n)
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');

        msg.innerHTML = formatted;

        // Render Quick Chips if available
        if (chips.length > 0) {
            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'abc-quick-chips';
            chips.forEach(chip => {
                const chipBtn = document.createElement('button');
                chipBtn.className = 'abc-chip';
                chipBtn.innerHTML = chip.label;
                chipBtn.addEventListener('click', () => handleChipClick(chip));
                chipsWrap.appendChild(chipBtn);
            });
            msg.appendChild(chipsWrap);
        }

        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    // Typing Indicator Effect
    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.id = 'abc-typing-active';
        typing.className = 'abc-typing-indicator';
        typing.innerHTML = `
            <div class="abc-typing-dot"></div>
            <div class="abc-typing-dot"></div>
            <div class="abc-typing-dot"></div>
        `;
        messagesEl.appendChild(typing);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typing = document.getElementById('abc-typing-active');
        if (typing) typing.remove();
    }

    // Scroll to latest message
    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Handle Quick Chip Action
    function handleChipClick(chip) {
        appendUserMessage(chip.label.replace(/^[^\w\s]+\s*/, '')); // Strip emoji for user message

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            if (chip.action === 'start_booking') {
                renderInChatBookingCard();
            } else if (chip.action === 'query_hair') {
                appendBotMessage(knowledgeBase.hair[0], [
                    { label: "📅 Book Haircut", action: "start_booking" },
                    { label: "✨ Skincare Advice", action: "query_skin" }
                ]);
            } else if (chip.action === 'query_skin') {
                appendBotMessage(knowledgeBase.skin[0], [
                    { label: "📅 Book Facial", action: "start_booking" },
                    { label: "💅 Nail Care", action: "query_nails" }
                ]);
            } else if (chip.action === 'query_nails') {
                appendBotMessage(knowledgeBase.nails[0], [
                    { label: "📅 Book Manicure", action: "start_booking" }
                ]);
            } else if (chip.action === 'query_pricing') {
                appendBotMessage(knowledgeBase.pricing[0], [
                    { label: "📅 Book Appointment", action: "start_booking" }
                ]);
            } else if (chip.action === 'query_hours') {
                appendBotMessage(knowledgeBase.hours[0], [
                    { label: "📅 Book Appointment", action: "start_booking" }
                ]);
            }
        }, 500);
    }

    // Natural Query Processing Engine
    function handleUserMessage(userText) {
        appendUserMessage(userText);
        const lower = userText.toLowerCase();

        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();

            if (lower.includes('book') || lower.includes('appointment') || lower.includes('reserve') || lower.includes('slot')) {
                renderInChatBookingCard();
            } else if (lower.includes('hair') || lower.includes('cut') || lower.includes('style') || lower.includes('color') || lower.includes('balayage')) {
                appendBotMessage(knowledgeBase.hair[0], [
                    { label: "📅 Book Hair Service", action: "start_booking" },
                    { label: "💰 View Pricing", action: "query_pricing" }
                ]);
            } else if (lower.includes('skin') || lower.includes('facial') || lower.includes('acne') || lower.includes('glow') || lower.includes('face')) {
                appendBotMessage(knowledgeBase.skin[0], [
                    { label: "📅 Book Gold Facial", action: "start_booking" }
                ]);
            } else if (lower.includes('nail') || lower.includes('manicure') || lower.includes('pedicure')) {
                appendBotMessage(knowledgeBase.nails[0], [
                    { label: "📅 Book Manicure", action: "start_booking" }
                ]);
            } else if (lower.includes('bridal') || lower.includes('marriage') || lower.includes('wedding') || lower.includes('makeup')) {
                appendBotMessage(knowledgeBase.bridal[0], [
                    { label: "📅 Reserve Bridal Consultation", action: "start_booking" }
                ]);
            } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('menu')) {
                appendBotMessage(knowledgeBase.pricing[0], [
                    { label: "📅 Book Appointment", action: "start_booking" }
                ]);
            } else if (lower.includes('hour') || lower.includes('time') || lower.includes('address') || lower.includes('location') || lower.includes('open') || lower.includes('where')) {
                appendBotMessage(knowledgeBase.hours[0], [
                    { label: "📅 Book Appointment", action: "start_booking" }
                ]);
            } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('abc')) {
                appendBotMessage("Hello! 😊 How can ABC assist you with your beauty and salon needs today?", [
                    { label: "📅 Book Appointment", action: "start_booking" },
                    { label: "✨ Skincare Advice", action: "query_skin" },
                    { label: "💇 Hair Solutions", action: "query_hair" }
                ]);
            } else {
                appendBotMessage("I'm here to help with haircuts, facial skin treatments, luxury gel manicures, and bridal suites! Would you like to book an appointment or view our service recommendations?", [
                    { label: "📅 Book Appointment", action: "start_booking" },
                    { label: "💰 View Services & Rates", action: "query_pricing" },
                    { label: "🕒 Operating Hours", action: "query_hours" }
                ]);
            }
        }, 600);
    }

    // Render In-Chat Interactive Booking Card Form
    function renderInChatBookingCard() {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'abc-msg abc-msg-bot w-full';
        
        // Tomorrow date string default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDateStr = tomorrow.toISOString().split('T')[0];

        cardContainer.innerHTML = `
            <div class="font-bold text-primary text-xs uppercase tracking-wider mb-1">📅 Interactive Booking Form</div>
            <div class="text-xs text-on-surface-variant mb-2">Complete your reservation right inside the chat!</div>
            
            <form id="abc-inchat-form" class="abc-card-form">
                <div>
                    <label>Select Service</label>
                    <select id="abc-form-service">
                        <option value="Signature Haircut & Styling (₹999)">Signature Haircut & Styling (₹999)</option>
                        <option value="Gold Hydradermie Facial (₹2,999)">Gold Hydradermie Facial (₹2,999)</option>
                        <option value="Balayage & Organic Gloss (₹4,999+)">Balayage & Organic Gloss (₹4,999+)</option>
                        <option value="Luxury Gel Manicure & Spa (₹1,299)">Luxury Gel Manicure & Spa (₹1,299)</option>
                        <option value="Royal Bridal Makeup Suite (₹9,999+)">Royal Bridal Makeup Suite (₹9,999+)</option>
                        <option value="Aromatherapy Body Detox (₹3,499)">Aromatherapy Body Detox (₹3,499)</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label>Preferred Date</label>
                        <input id="abc-form-date" type="date" value="${defaultDateStr}" required />
                    </div>
                    <div>
                        <label>Time Slot</label>
                        <select id="abc-form-time">
                            <option>10:00 AM</option>
                            <option>11:30 AM</option>
                            <option>01:00 PM</option>
                            <option>02:30 PM</option>
                            <option>04:00 PM</option>
                            <option>05:30 PM</option>
                            <option>07:00 PM</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Your Name</label>
                    <input id="abc-form-name" type="text" placeholder="Enter your full name" required />
                </div>

                <div>
                    <label>Phone Number</label>
                    <input id="abc-form-phone" type="tel" placeholder="Enter phone number" required />
                </div>

                <button type="submit" class="abc-btn-submit">
                    Confirm Booking & Send WhatsApp
                </button>
            </form>
        `;

        messagesEl.appendChild(cardContainer);
        scrollToBottom();

        // Bind form submit inside chat
        document.getElementById('abc-inchat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const service = document.getElementById('abc-form-service').value;
            const date = document.getElementById('abc-form-date').value;
            const time = document.getElementById('abc-form-time').value;
            const name = document.getElementById('abc-form-name').value;
            const phone = document.getElementById('abc-form-phone').value;

            // Process Confirmation
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();

                // Save state
                state.bookingDetails = { service, date, time, name, phone };

                // Build Confirmation Receipt
                const confirmMsg = `🎉 **Booking Confirmed with ABC!**\n\n` +
                    `• **Name**: ${name}\n` +
                    `• **Service**: ${service}\n` +
                    `• **Date & Time**: ${date} at ${time}\n` +
                    `• **Phone**: ${phone}\n\n` +
                    `We have reserved your slot! Click below to send direct confirmation to our salon team on WhatsApp:`;

                appendBotMessage(confirmMsg);

                // Build WhatsApp Redirect Button
                const shopPhone = (window.shopState && window.shopState.phone) ? window.shopState.phone : "919876543210";
                const text = `Hello ABC Salon! I just booked via ABC Chatbot:%0A%0A` +
                             `👤 Name: ${encodeURIComponent(name)}%0A` +
                             `💇 Service: ${encodeURIComponent(service)}%0A` +
                             `📅 Date: ${encodeURIComponent(date)}%0A` +
                             `⏰ Time: ${encodeURIComponent(time)}%0A` +
                             `📞 Phone: ${encodeURIComponent(phone)}`;
                const waUrl = `https://wa.me/${shopPhone}?text=${text}`;

                const waBtnWrap = document.createElement('div');
                waBtnWrap.className = 'abc-msg abc-msg-bot w-full';
                waBtnWrap.innerHTML = `
                    <a href="${waUrl}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <span>Send WhatsApp Confirmation</span>
                    </a>
                `;
                messagesEl.appendChild(waBtnWrap);
                scrollToBottom();

            }, 600);
        });
    }

    // Auto-launch initialization on window load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
