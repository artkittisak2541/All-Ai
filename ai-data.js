// AI Database - ทุก AI บนโลก 🌍 จัดเป็นหมวดหมู่
const aiCategories = [
    {
        id: 'chat',
        name: 'AI คุยแชท / แชทบอท',
        icon: 'fas fa-comments',
        colorClass: 'category-chat',
        description: 'AI สำหรับสนทนาและตอบคำถามทั่วไป',
        ais: [
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                provider: 'OpenAI',
                icon: 'fas fa-comment',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
                colorClass: 'chatgpt',
                description: 'AI สนทนาที่ทรงพลังที่สุด พัฒนาโดย OpenAI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['สนทนา', 'เขียนโค้ด', 'แปลภาษา', 'สรุปข้อความ'],
                webUrl: 'https://chat.openai.com/',
                mobileUrl: 'chatgpt://',
                fallbackUrl: 'https://chat.openai.com/'
            },
            {
                id: 'claude',
                name: 'Claude',
                provider: 'Anthropic',
                icon: 'fas fa-brain',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Claude_logo.svg',
                colorClass: 'claude',
                description: 'AI ที่ปลอดภัยและมีจริยธรรม พัฒนาโดย Anthropic',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['เขียนเนื้อหา', 'วิเคราะห์', 'สรุปเอกสาร', 'ให้คำแนะนำ'],
                webUrl: 'https://claude.ai/',
                mobileUrl: 'claude://',
                fallbackUrl: 'https://claude.ai/'
            },
            {
                id: 'gemini',
                name: 'Gemini',
                provider: 'Google',
                icon: 'fas fa-gem',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Google_Gemini_logo.svg',
                colorClass: 'gemini',
                description: 'AI จาก Google ที่ผสานการค้นหาและสร้างสรรค์',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['ค้นหา', 'สร้างภาพ', 'เขียนโค้ด', 'แปลภาษา'],
                webUrl: 'https://gemini.google.com/',
                mobileUrl: 'gemini://',
                fallbackUrl: 'https://gemini.google.com/'
            },
            {
                id: 'deepseek',
                name: 'DeepSeek',
                provider: 'DeepSeek AI',
                icon: 'fas fa-search-deep',
                logoUrl: 'https://seeklogo.com/images/D/deepseek-logo-D79E6DBF71-seeklogo.com.png',
                colorClass: 'deepseek',
                description: 'AI ฟรีที่มีความสามารถสูง รองรับ 128K context',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เขียนโค้ด', 'แก้บั๊ก', 'สอนโปรแกรมมิ่ง', 'วิเคราะห์โค้ด'],
                webUrl: 'https://chat.deepseek.com/',
                mobileUrl: null,
                fallbackUrl: 'https://chat.deepseek.com/'
            },
            {
                id: 'xai-grok',
                name: 'xAI Grok',
                provider: 'xAI',
                icon: 'fas fa-bolt',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_AI_Logo.svg/240px-X_AI_Logo.svg.png',
                colorClass: 'xai',
                description: 'AI จาก Elon Musk ที่มีอารมณ์ขันและอัปเดตข่าวล่าสุด',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'ทวีตเตอร์', type: 'mobile' }
                ],
                features: ['สนทนา', 'อัปเดตล่าสุด', 'มีอารมณ์ขัน', 'ค้นหา'],
                webUrl: 'https://grok.x.ai/',
                mobileUrl: 'twitter://',
                fallbackUrl: 'https://grok.x.ai/'
            },
            {
                id: 'meta-ai',
                name: 'Meta AI',
                provider: 'Meta',
                icon: 'fas fa-robot',
                logoUrl: 'https://static.xx.fbcdn.net/rsrc.php/y5/r/b1bZwjaoQYb.ico',
                colorClass: 'meta',
                description: 'AI จาก Meta ที่ผสานใน Facebook, Instagram',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['สนทนา', 'สร้างภาพ', 'ค้นหา', 'โซเชียล'],
                webUrl: 'https://www.meta.ai/',
                mobileUrl: 'fb://',
                fallbackUrl: 'https://www.meta.ai/'
            },
            {
                id: 'ms-copilot',
                name: 'MS Copilot',
                provider: 'Microsoft',
                icon: 'fas fa-windows',
                logoUrl: 'https://img.icons8.com/color/96/microsoft-copilot.png',
                colorClass: 'copilot',
                description: 'AI จาก Microsoft ที่ผสานใน Windows และ Office',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['Office', 'Windows', 'ค้นหา', 'สร้างภาพ'],
                webUrl: 'https://copilot.microsoft.com/',
                mobileUrl: 'bing://',
                fallbackUrl: 'https://copilot.microsoft.com/'
            },
            {
                id: 'perplexity',
                name: 'Perplexity',
                provider: 'Perplexity AI',
                icon: 'fas fa-compass',
                logoUrl: 'https://www.perplexity.ai/images/og-image.png',
                colorClass: 'perplexity',
                description: 'AI ค้นหาข้อมูลแบบเรียลไทม์ พร้อมแหล่งอ้างอิง',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['ค้นหา', 'วิจัย', 'แหล่งอ้างอิง', 'เรียลไทม์'],
                webUrl: 'https://www.perplexity.ai/',
                mobileUrl: 'perplexity://',
                fallbackUrl: 'https://www.perplexity.ai/'
            },
            {
                id: 'character-ai',
                name: 'Character.AI',
                provider: 'Character AI',
                icon: 'fas fa-user-astronaut',
                logoUrl: 'https://character.ai/assets/logo.png',
                colorClass: 'character',
                description: 'AI สนทนากับตัวละครที่มีบุคลิกเฉพาะ',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['ตัวละคร', 'บทบาทสมมติ', 'สนทนา', 'สร้างสรรค์'],
                webUrl: 'https://character.ai/',
                mobileUrl: 'characterai://',
                fallbackUrl: 'https://character.ai/'
            },
            {
                id: 'poe',
                name: 'Poe',
                provider: 'Quora',
                icon: 'fas fa-question-circle',
                logoUrl: 'https://poe.com/favicon.ico',
                colorClass: 'poe',
                description: 'แพลตฟอร์มรวม AI หลายตัวในที่เดียว',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['หลาย AI', 'แชท', 'สร้างบอท', 'ค้นหา'],
                webUrl: 'https://poe.com/',
                mobileUrl: 'poe://',
                fallbackUrl: 'https://poe.com/'
            },
            {
                id: 'msty-ai',
                name: 'Msty AI',
                provider: 'Msty',
                icon: 'fas fa-ghost',
                logoUrl: 'https://msty.ai/favicon.ico',
                colorClass: 'msty',
                description: 'AI สนทนารุ่นใหม่ที่มีประสิทธิภาพสูง',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สนทนา', 'สร้างภาพ', 'เขียนโค้ด', 'หลายภาษา'],
                webUrl: 'https://msty.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://msty.ai/'
            },
            {
                id: 'pi-ai',
                name: 'Pi',
                provider: 'Inflection AI',
                icon: 'fas fa-comment-dots',
                logoUrl: 'https://pi.ai/favicon.ico',
                colorClass: 'pi',
                description: 'AI เพื่อนคู่ใจที่มีความเห็นอกเห็นใจ',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['สนทนา', 'ให้คำปรึกษา', 'เป็นกันเอง', 'หลายภาษา'],
                webUrl: 'https://pi.ai/',
                mobileUrl: 'pi://',
                fallbackUrl: 'https://pi.ai/'
            },
            {
                id: 'you-ai',
                name: 'You.com AI',
                provider: 'You.com',
                icon: 'fas fa-search',
                logoUrl: 'https://you.com/favicon.ico',
                colorClass: 'you',
                description: 'AI ค้นหาที่ผสานการสร้างสรรค์',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ค้นหา', 'สร้างโค้ด', 'เขียนเนื้อหา', 'ภาพ'],
                webUrl: 'https://you.com/',
                mobileUrl: null,
                fallbackUrl: 'https://you.com/'
            },
            {
                id: 'huggingchat',
                name: 'HuggingChat',
                provider: 'Hugging Face',
                icon: 'fas fa-robot',
                logoUrl: 'https://huggingface.co/front/assets/huggingface_logo.svg',
                colorClass: 'hugging',
                description: 'AI แชทโอเพ่นซอร์สจาก Hugging Face',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'โอเพ่นซอร์ส', type: 'free' }
                ],
                features: ['โอเพ่นซอร์ส', 'แชท', 'หลายโมเดล', 'API'],
                webUrl: 'https://huggingface.co/chat',
                mobileUrl: null,
                fallbackUrl: 'https://huggingface.co/chat'
            },
            {
                id: 'jan-ai',
                name: 'Jan AI',
                provider: 'Jan',
                icon: 'fas fa-desktop',
                logoUrl: 'https://jan.ai/favicon.ico',
                colorClass: 'jan',
                description: 'AI แชทที่ทำงานแบบออฟไลน์ได้',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'ออฟไลน์', type: 'local' }
                ],
                features: ['ออฟไลน์', 'แชท', 'หลายโมเดล', 'ลับ'],
                webUrl: 'https://jan.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://jan.ai/'
            },
            {
                id: 'phind',
                name: 'Phind',
                provider: 'Phind',
                icon: 'fas fa-search',
                logoUrl: 'https://www.phind.com/favicon.ico',
                colorClass: 'phind',
                description: 'AI ค้นหาสำหรับนักพัฒนาโดยเฉพาะ',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'สำหรับ Dev', type: 'free' }
                ],
                features: ['สำหรับ Dev', 'ค้นหา', 'โค้ด', 'เทคนิค'],
                webUrl: 'https://www.phind.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.phind.com/'
            },
            {
                id: 'rewind-ai',
                name: 'Rewind AI',
                provider: 'Rewind',
                icon: 'fas fa-undo',
                logoUrl: 'https://www.rewind.ai/favicon.ico',
                colorClass: 'rewind',
                description: 'AI ที่ถามจากข้อมูลในเครื่องของคุณ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'ข้อมูลส่วนตัว', type: 'local' }
                ],
                features: ['ข้อมูลส่วนตัว', 'ค้นหา', 'สรุป', 'ออฟไลน์'],
                webUrl: 'https://www.rewind.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.rewind.ai/'
            }
        ]
    },
    {
        id: 'slide',
        name: 'AI ทำสไลด์พรีเซนต์',
        icon: 'fas fa-presentation-screen',
        colorClass: 'category-slide',
        description: 'AI ช่วยสร้างและออกแบบสไลด์พรีเซนต์เทชั่น',
        ais: [
            {
                id: 'beautiful-ai',
                name: 'Beautiful.Ai',
                provider: 'Beautiful.AI',
                icon: 'fas fa-palette',
                logoUrl: 'https://www.beautiful.ai/static/favicon-32x32.png',
                colorClass: 'beautiful',
                description: 'AI ช่วยออกแบบสไลด์สวยงามอัตโนมัติ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ออกแบบอัตโนมัติ', 'เทมเพลต', 'ล้ำสมัย'],
                webUrl: 'https://www.beautiful.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.beautiful.ai/'
            },
            {
                id: 'gamma',
                name: 'Gamma',
                provider: 'Gamma',
                icon: 'fas fa-bezier-curve',
                logoUrl: 'https://assets-global.website-files.com/6410ebf8e483b5bb2c86eb27/6410ebf8e483b5a93f86fbd2_AB%20testing.png',
                colorClass: 'gamma',
                description: 'สร้างพรีเซนต์เทชั่นด้วย AI ในไม่กี่นาที',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สร้างเร็ว', 'เทมเพลต', 'ปรับแต่งได้'],
                webUrl: 'https://gamma.app/',
                mobileUrl: null,
                fallbackUrl: 'https://gamma.app/'
            },
            {
                id: 'pitch',
                name: 'Pitch',
                provider: 'Pitch',
                icon: 'fas fa-chart-line',
                logoUrl: 'https://pitch.com/favicon.ico',
                colorClass: 'pitch',
                description: 'สร้างพรีเซนต์แบบมืออาชีพด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['มืออาชีพ', 'เทมเพลต', 'แชร์ง่าย'],
                webUrl: 'https://pitch.com/',
                mobileUrl: null,
                fallbackUrl: 'https://pitch.com/'
            },
            {
                id: 'canva-presentations',
                name: 'Canva Presentations AI',
                provider: 'Canva',
                icon: 'fas fa-object-group',
                logoUrl: 'https://static.canva.com/static/images/android-chrome-192x192.png',
                colorClass: 'canva',
                description: 'สร้างพรีเซนต์ใน Canva ด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['เทมเพลต', 'ออกแบบ', 'ภาพ', 'หลายรูปแบบ'],
                webUrl: 'https://www.canva.com/presentations/',
                mobileUrl: 'canva://',
                fallbackUrl: 'https://www.canva.com/presentations/'
            },
            {
                id: 'decktopus',
                name: 'Decktopus AI',
                provider: 'Decktopus',
                icon: 'fas fa-kiwi-bird',
                logoUrl: 'https://www.decktopus.com/favicon.ico',
                colorClass: 'decktopus',
                description: 'สร้างพรีเซนต์อัตโนมัติด้วยคำสั่งเสียง',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เสียง', 'อัตโนมัติ', 'เทมเพลต', 'เร็ว'],
                webUrl: 'https://www.decktopus.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.decktopus.com/'
            },
            {
                id: 'magicslides',
                name: 'MagicSlides',
                provider: 'MagicSlides',
                icon: 'fas fa-magic',
                logoUrl: 'https://www.magicslides.app/favicon.ico',
                colorClass: 'magicslides',
                description: 'แปลงเอกสารเป็นสไลด์อัตโนมัติ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['แปลงเอกสาร', 'อัตโนมัติ', 'เทมเพลต', 'เร็ว'],
                webUrl: 'https://www.magicslides.app/',
                mobileUrl: null,
                fallbackUrl: 'https://www.magicslides.app/'
            },
            {
                id: 'slidesai',
                name: 'SlidesAI.io',
                provider: 'SlidesAI',
                icon: 'fas fa-robot',
                logoUrl: 'https://www.slidesai.io/favicon.ico',
                colorClass: 'slidesai',
                description: 'สร้างสไลด์จากข้อความด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ข้อความเป็นสไลด์', 'อัตโนมัติ', 'หลายภาษา'],
                webUrl: 'https://www.slidesai.io/',
                mobileUrl: null,
                fallbackUrl: 'https://www.slidesai.io/'
            },
            {
                id: 'presentation-bot',
                name: 'Presentations by Designs.ai',
                provider: 'Designs.ai',
                icon: 'fas fa-file-powerpoint',
                logoUrl: 'https://designs.ai/favicon.ico',
                colorClass: 'designsai',
                description: 'สร้างพรีเซนต์ด้วย AI ใน 2 นาที',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เร็ว', 'เทมเพลต', 'ออกแบบ', 'หลายภาษา'],
                webUrl: 'https://designs.ai/presentations',
                mobileUrl: null,
                fallbackUrl: 'https://designs.ai/presentations'
            },
            {
                id: 'prezi-ai',
                name: 'Prezi AI',
                provider: 'Prezi',
                icon: 'fas fa-expand',
                logoUrl: 'https://prezi.com/favicon.ico',
                colorClass: 'prezi',
                description: 'สร้างพรีเซนต์แบบอินเทอร์แอคทีฟด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['อินเทอร์แอคทีฟ', 'เคลื่อนไหว', 'เทมเพลต'],
                webUrl: 'https://prezi.com/',
                mobileUrl: null,
                fallbackUrl: 'https://prezi.com/'
            },
            {
                id: 'visme-presentations',
                name: 'Visme AI Presentation',
                provider: 'Visme',
                icon: 'fas fa-chart-area',
                logoUrl: 'https://www.visme.co/favicon.ico',
                colorClass: 'visme',
                description: 'สร้างพรีเซนต์ข้อมูลภาพด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ข้อมูลภาพ', 'อินโฟกราฟิก', 'เทมเพลต'],
                webUrl: 'https://www.visme.co/presentation-maker/',
                mobileUrl: null,
                fallbackUrl: 'https://www.visme.co/presentation-maker/'
            },
            {
                id: 'sendsteps-ai',
                name: 'Sendsteps AI',
                provider: 'Sendsteps',
                icon: 'fas fa-poll',
                logoUrl: 'https://www.sendsteps.com/favicon.ico',
                colorClass: 'sendsteps',
                description: 'สร้างพรีเซนต์แบบมีปฏิสัมพันธ์กับผู้ชม',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ปฏิสัมพันธ์', 'แบบสำรวจ', 'เรียลไทม์', 'เทมเพลต'],
                webUrl: 'https://www.sendsteps.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.sendsteps.com/'
            }
        ]
    },
    {
        id: 'code',
        name: 'AI ช่วยเขียนโค้ด',
        icon: 'fas fa-code',
        colorClass: 'category-code',
        description: 'AI สำหรับช่วยพัฒนาและเขียนโค้ดโปรแกรม',
        ais: [
            {
                id: 'github-copilot',
                name: 'GitHub Copilot',
                provider: 'Microsoft',
                icon: 'fas fa-code-branch',
                logoUrl: 'https://github.githubassets.com/assets/copilot-logo-dark-6c30ffbc3c5d.png',
                colorClass: 'copilot',
                description: 'AI สำหรับช่วยเขียนโค้ดโดยเฉพาะ ใน VS Code',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'สำหรับ Dev', type: 'paid' }
                ],
                features: ['เขียนโค้ด', 'Auto Complete', 'แก้บั๊ก', 'รีเฟคเตอร์'],
                webUrl: 'https://github.com/features/copilot',
                mobileUrl: null,
                fallbackUrl: 'https://github.com/features/copilot'
            },
            {
                id: 'cursor',
                name: 'Cursor',
                provider: 'Cursor',
                icon: 'fas fa-mouse-pointer',
                logoUrl: 'https://www.cursor.sh/apple-touch-icon.png',
                colorClass: 'cursor',
                description: 'AI IDE สำหรับเขียนโค้ดอย่างชาญฉลาด',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เดสก์ท็อป', type: 'free' }
                ],
                features: ['IDE', 'เขียนโค้ด', 'แก้บั๊ก', 'รีเฟคเตอร์'],
                webUrl: 'https://cursor.sh/',
                mobileUrl: null,
                fallbackUrl: 'https://cursor.sh/'
            },
            {
                id: 'codeium',
                name: 'Codeium',
                provider: 'Codeium',
                icon: 'fas fa-atom',
                logoUrl: 'https://codeium.com/favicon.ico',
                colorClass: 'codeium',
                description: 'AI ช่วยเขียนโค้ดฟรีสำหรับหลายภาษา',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'สำหรับ Dev', type: 'free' }
                ],
                features: ['ฟรี', 'หลายภาษา', 'Auto Complete', 'IDE'],
                webUrl: 'https://codeium.com/',
                mobileUrl: null,
                fallbackUrl: 'https://codeium.com/'
            },
            {
                id: 'sourcegraph-cody',
                name: 'Sourcegraph Cody',
                provider: 'Sourcegraph',
                icon: 'fas fa-code-branch',
                logoUrl: 'https://sourcegraph.com/favicon.ico',
                colorClass: 'sourcegraph',
                description: 'AI ช่วยเขียนโค้ดที่เข้าใจโค้ดทั้งหมดของคุณ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'สำหรับ Dev', type: 'paid' }
                ],
                features: ['เข้าใจโค้ด', 'เขียนใหม่', 'แก้บั๊ก', 'IDE'],
                webUrl: 'https://sourcegraph.com/cody',
                mobileUrl: null,
                fallbackUrl: 'https://sourcegraph.com/cody'
            },
            {
                id: 'amazon-codewhisperer',
                name: 'Amazon CodeWhisperer',
                provider: 'Amazon',
                icon: 'fas fa-cloud',
                logoUrl: 'https://aws.amazon.com/favicon.ico',
                colorClass: 'aws',
                description: 'AI ช่วยเขียนโค้ดจาก AWS',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'สำหรับ Dev', type: 'paid' }
                ],
                features: ['AWS', 'เขียนโค้ด', 'หลายภาษา', 'IDE'],
                webUrl: 'https://aws.amazon.com/codewhisperer/',
                mobileUrl: null,
                fallbackUrl: 'https://aws.amazon.com/codewhisperer/'
            },
            {
                id: 'mutable-ai',
                name: 'Mutable AI',
                provider: 'Mutable',
                icon: 'fas fa-bolt',
                logoUrl: 'https://mutable.ai/favicon.ico',
                colorClass: 'mutable',
                description: 'AI สร้างและแปลงโค้ดอัตโนมัติ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['แปลงโค้ด', 'เขียนใหม่', 'หลายภาษา', 'เร็ว'],
                webUrl: 'https://mutable.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://mutable.ai/'
            },
            {
                id: 'continue-dev',
                name: 'Continue.dev',
                provider: 'Continue',
                icon: 'fas fa-play',
                logoUrl: 'https://continue.dev/favicon.ico',
                colorClass: 'continue',
                description: 'IDE อัจฉริยะสำหรับนักพัฒนา',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'สำหรับ Dev', type: 'free' }
                ],
                features: ['IDE', 'เขียนโค้ด', 'แก้บั๊ก', 'หลายภาษา'],
                webUrl: 'https://continue.dev/',
                mobileUrl: null,
                fallbackUrl: 'https://continue.dev/'
            },
            {
                id: 'sweep-ai',
                name: 'Sweep AI',
                provider: 'Sweep',
                icon: 'fas fa-broom',
                logoUrl: 'https://sweep.dev/favicon.ico',
                colorClass: 'sweep',
                description: 'AI ช่วยเขียนและรีเฟคเตอร์โค้ด',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'สำหรับ Dev', type: 'paid' }
                ],
                features: ['รีเฟคเตอร์', 'เขียนโค้ด', 'แก้บั๊ก', 'อัตโนมัติ'],
                webUrl: 'https://sweep.dev/',
                mobileUrl: null,
                fallbackUrl: 'https://sweep.dev/'
            },
            {
                id: 'aider',
                name: 'Aider',
                provider: 'Aider',
                icon: 'fas fa-hands-helping',
                logoUrl: 'https://aider.chat/favicon.ico',
                colorClass: 'aider',
                description: 'AI ช่วยเขียนโค้ดในเทอร์มินัล',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เทอร์มินัล', type: 'free' }
                ],
                features: ['เทอร์มินัล', 'เขียนโค้ด', 'หลายภาษา', 'CLI'],
                webUrl: 'https://aider.chat/',
                mobileUrl: null,
                fallbackUrl: 'https://aider.chat/'
            },
            {
                id: 'devin-ai',
                name: 'Devin AI',
                provider: 'Cognition',
                icon: 'fas fa-robot',
                logoUrl: 'https://www.cognition.ai/favicon.ico',
                colorClass: 'devin',
                description: 'วิศวกรซอฟต์แวร์ AI แรกของโลก',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'สำหรับ Dev', type: 'paid' }
                ],
                features: ['วิศวกรซอฟต์แวร์', 'เขียนโค้ด', 'สร้างแอป', 'อัตโนมัติ'],
                webUrl: 'https://www.cognition.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.cognition.ai/'
            },
            {
                id: 'blackbox-ai',
                name: 'Blackbox AI',
                provider: 'Blackbox',
                icon: 'fas fa-cube',
                logoUrl: 'https://www.blackbox.ai/favicon.ico',
                colorClass: 'blackbox',
                description: 'AI ช่วยเขียนโค้ดและแปลงโค้ด',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เขียนโค้ด', 'แปลงโค้ด', 'หลายภาษา', 'ค้นหา'],
                webUrl: 'https://www.blackbox.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.blackbox.ai/'
            }
        ]
    },
    {
        id: 'email',
        name: 'AI ช่วยเขียนอีเมล',
        icon: 'fas fa-envelope',
        colorClass: 'category-email',
        description: 'AI สำหรับช่วยเขียนและจัดการอีเมล',
        ais: [
            {
                id: 'clippit-ai',
                name: 'Clippit.Ai',
                provider: 'Clippit',
                icon: 'fas fa-paperclip',
                logoUrl: 'https://clippit.ai/favicon.ico',
                colorClass: 'clippit',
                description: 'AI ช่วยเขียนและตอบอีเมลอัตโนมัติ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เขียนอีเมล', 'ตอบอัตโนมัติ', 'หลายภาษา'],
                webUrl: 'https://clippit.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://clippit.ai/'
            },
            {
                id: 'flowrite',
                name: 'Flowrite',
                provider: 'Flowrite',
                icon: 'fas fa-keyboard',
                logoUrl: 'https://flowrite.com/favicon.ico',
                colorClass: 'flowrite',
                description: 'AI ช่วยเขียนอีเมลจากคำสั่งสั้นๆ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เขียนเร็ว', 'เทมเพลต', 'หลายภาษา', 'อัตโนมัติ'],
                webUrl: 'https://flowrite.com/',
                mobileUrl: null,
                fallbackUrl: 'https://flowrite.com/'
            },
            {
                id: 'lavender-ai',
                name: 'Lavender AI',
                provider: 'Lavender',
                icon: 'fas fa-envelope-open-text',
                logoUrl: 'https://www.lavender.ai/favicon.ico',
                colorClass: 'lavender',
                description: 'AI ช่วยเขียนอีเมลเพื่อการตลาดที่ดีขึ้น',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['การตลาด', 'เขียนอีเมล', 'วิเคราะห์', 'ปรับปรุง'],
                webUrl: 'https://www.lavender.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.lavender.ai/'
            },
            {
                id: 'smartwriter-ai',
                name: 'Smartwriter AI',
                provider: 'Smartwriter',
                icon: 'fas fa-magic',
                logoUrl: 'https://smartwriter.ai/favicon.ico',
                colorClass: 'smartwriter',
                description: 'AI ช่วยเขียนอีเมลแบบส่วนบุคคล',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ส่วนบุคคล', 'เขียนอีเมล', 'หลายภาษา', 'เทมเพลต'],
                webUrl: 'https://smartwriter.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://smartwriter.ai/'
            },
            {
                id: 'hoppy-copy',
                name: 'Hoppy Copy',
                provider: 'Hoppy Copy',
                icon: 'fas fa-copy',
                logoUrl: 'https://hoppycopy.co/favicon.ico',
                colorClass: 'hoppy',
                description: 'AI ช่วยเขียนอีเมลสำหรับธุรกิจ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ธุรกิจ', 'เขียนอีเมล', 'เทมเพลต', 'หลายภาษา'],
                webUrl: 'https://hoppycopy.co/',
                mobileUrl: null,
                fallbackUrl: 'https://hoppycopy.co/'
            },
            {
                id: 'warmer-ai',
                name: 'Warmer.ai',
                provider: 'Warmer',
                icon: 'fas fa-fire',
                logoUrl: 'https://warmer.ai/favicon.ico',
                colorClass: 'warmer',
                description: 'AI ช่วยเขียนอีเมลเพื่อสร้างความสัมพันธ์',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ความสัมพันธ์', 'เขียนอีเมล', 'ส่วนบุคคล', 'หลายภาษา'],
                webUrl: 'https://warmer.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://warmer.ai/'
            },
            {
                id: 'ghostwrite',
                name: 'Ghostwrite',
                provider: 'HubSpot',
                icon: 'fas fa-ghost',
                logoUrl: 'https://www.hubspot.com/favicon.ico',
                colorClass: 'ghostwrite',
                description: 'AI ช่วยเขียนอีเมลใน HubSpot',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'CRM', type: 'paid' }
                ],
                features: ['CRM', 'เขียนอีเมล', 'การตลาด', 'หลายภาษา'],
                webUrl: 'https://www.hubspot.com/products/crm',
                mobileUrl: null,
                fallbackUrl: 'https://www.hubspot.com/products/crm'
            }
        ]
    },
    {
        id: 'image',
        name: 'AI ช่วยสร้างภาพ',
        icon: 'fas fa-image',
        colorClass: 'category-image',
        description: 'AI สำหรับสร้างและแก้ไขภาพ',
        ais: [
            {
                id: 'dalle',
                name: 'DALL·E 3',
                provider: 'OpenAI',
                icon: 'fas fa-paint-brush',
                logoUrl: 'https://labs.openai.com/favicon.png',
                colorClass: 'dalle',
                description: 'AI สร้างภาพจากข้อความ พัฒนาโดย OpenAI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สร้างภาพ', 'จากข้อความ', 'หลายสไตล์', 'คุณภาพสูง'],
                webUrl: 'https://labs.openai.com/',
                mobileUrl: null,
                fallbackUrl: 'https://labs.openai.com/'
            },
            {
                id: 'midjourney',
                name: 'Midjourney',
                provider: 'Midjourney',
                icon: 'fas fa-palette',
                logoUrl: 'https://cdn.midjourney.com/favicon.ico',
                colorClass: 'midjourney',
                description: 'AI สร้างภาพศิลปะที่สวยงามสำหรับสไลด์',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'Discord', type: 'free' }
                ],
                features: ['สร้างภาพ', 'ศิลปะ', 'ดีไซน์', 'ภาพเหมือน'],
                webUrl: 'https://www.midjourney.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.midjourney.com/'
            },
            {
                id: 'adobe-firefly',
                name: 'Adobe Firefly',
                provider: 'Adobe',
                icon: 'fas fa-fire',
                logoUrl: 'https://www.adobe.com/content/dam/cc/icons/firefly-cc-app-icon.svg',
                colorClass: 'firefly',
                description: 'AI สร้างภาพจาก Adobe ผู้เชี่ยวชาญด้านครีเอทีฟ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สร้างภาพ', 'แก้ไขภาพ', 'ครีเอทีฟ', 'คุณภาพสูง'],
                webUrl: 'https://firefly.adobe.com/',
                mobileUrl: null,
                fallbackUrl: 'https://firefly.adobe.com/'
            },
            {
                id: 'leonardo-ai',
                name: 'Leonardo AI',
                provider: 'Leonardo',
                icon: 'fas fa-paint-brush',
                logoUrl: 'https://leonardo.ai/favicon.ico',
                colorClass: 'leonardo',
                description: 'AI สร้างภาพเกมและดีไซน์',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เกม', 'ดีไซน์', 'สร้างภาพ', 'หลายสไตล์'],
                webUrl: 'https://leonardo.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://leonardo.ai/'
            },
            {
                id: 'playground-ai',
                name: 'Playground AI',
                provider: 'Playground',
                icon: 'fas fa-gamepad',
                logoUrl: 'https://playgroundai.com/favicon.ico',
                colorClass: 'playground',
                description: 'AI สร้างภาพและแต่งภาพฟรี',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ฟรี', 'สร้างภาพ', 'แต่งภาพ', 'หลายฟิลเตอร์'],
                webUrl: 'https://playgroundai.com/',
                mobileUrl: null,
                fallbackUrl: 'https://playgroundai.com/'
            },
            {
                id: 'nightcafe',
                name: 'NightCafe',
                provider: 'NightCafe',
                icon: 'fas fa-moon',
                logoUrl: 'https://nightcafe.studio/favicon.ico',
                colorClass: 'nightcafe',
                description: 'AI สร้างภาพศิลปะและภาพเหมือน',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ศิลปะ', 'ภาพเหมือน', 'สร้างภาพ', 'หลายสไตล์'],
                webUrl: 'https://nightcafe.studio/',
                mobileUrl: null,
                fallbackUrl: 'https://nightcafe.studio/'
            },
            {
                id: 'dreamstudio',
                name: 'DreamStudio',
                provider: 'Stability AI',
                icon: 'fas fa-bed',
                logoUrl: 'https://dreamstudio.ai/favicon.ico',
                colorClass: 'dreamstudio',
                description: 'AI สร้างภาพจาก Stable Diffusion',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['Stable Diffusion', 'สร้างภาพ', 'หลายสไตล์', 'API'],
                webUrl: 'https://dreamstudio.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://dreamstudio.ai/'
            },
            {
                id: 'artbreeder',
                name: 'Artbreeder',
                provider: 'Artbreeder',
                icon: 'fas fa-dna',
                logoUrl: 'https://www.artbreeder.com/favicon.ico',
                colorClass: 'artbreeder',
                description: 'AI ผสมภาพและสร้างภาพใหม่',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ผสมภาพ', 'สร้างภาพ', 'หลายสไตล์', 'คลังภาพ'],
                webUrl: 'https://www.artbreeder.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.artbreeder.com/'
            },
            {
                id: 'imagine-meta',
                name: 'Imagine by Meta',
                provider: 'Meta',
                icon: 'fas fa-images',
                logoUrl: 'https://imagine.meta.com/favicon.ico',
                colorClass: 'imagine',
                description: 'AI สร้างภาพจาก Meta',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สร้างภาพ', 'หลายสไตล์', 'ฟรี', 'ง่าย'],
                webUrl: 'https://imagine.meta.com/',
                mobileUrl: null,
                fallbackUrl: 'https://imagine.meta.com/'
            },
            {
                id: 'picsart-ai',
                name: 'PicsArt AI',
                provider: 'PicsArt',
                icon: 'fas fa-camera-retro',
                logoUrl: 'https://picsart.com/favicon.ico',
                colorClass: 'picsart',
                description: 'AI สร้างและแก้ไขภาพ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['แก้ไขภาพ', 'สร้างภาพ', 'ฟิลเตอร์', 'หลายรูปแบบ'],
                webUrl: 'https://picsart.com/ai-image-generator',
                mobileUrl: 'picsart://',
                fallbackUrl: 'https://picsart.com/ai-image-generator'
            },
            {
                id: 'fotor-ai',
                name: 'Fotor AI',
                provider: 'Fotor',
                icon: 'fas fa-camera',
                logoUrl: 'https://www.fotor.com/favicon.ico',
                colorClass: 'fotor',
                description: 'AI สร้างภาพและออกแบบกราฟิก',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ออกแบบ', 'สร้างภาพ', 'แก้ไข', 'เทมเพลต'],
                webUrl: 'https://www.fotor.com/features/ai-image-generator/',
                mobileUrl: null,
                fallbackUrl: 'https://www.fotor.com/features/ai-image-generator/'
            }
        ]
    },
    {
        id: 'excel',
        name: 'AI ช่วยทำ Excel',
        icon: 'fas fa-file-excel',
        colorClass: 'category-excel',
        description: 'AI สำหรับช่วยทำงานกับสเปรดชีตและ Excel',
        ais: [
            {
                id: 'numerous-ai',
                name: 'Numerous AI',
                provider: 'Numerous',
                icon: 'fas fa-list-ol',
                logoUrl: 'https://numerous.ai/favicon.ico',
                colorClass: 'numerous',
                description: 'AI ช่วยทำงานกับ Excel และ Google Sheets',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['Excel', 'Google Sheets', 'สูตร', 'วิเคราะห์'],
                webUrl: 'https://numerous.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://numerous.ai/'
            },
            {
                id: 'sheetplus-ai',
                name: 'Sheet+ AI',
                provider: 'Sheet+',
                icon: 'fas fa-plus',
                logoUrl: 'https://sheetplus.ai/favicon.ico',
                colorClass: 'sheetplus',
                description: 'AI ช่วยเขียนสูตร Excel และ Google Sheets',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สูตร', 'Excel', 'Google Sheets', 'เขียนโค้ด'],
                webUrl: 'https://sheetplus.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://sheetplus.ai/'
            },
            {
                id: 'akkio',
                name: 'Akkio',
                provider: 'Akkio',
                icon: 'fas fa-chart-line',
                logoUrl: 'https://www.akkio.com/favicon.ico',
                colorClass: 'akkio',
                description: 'AI วิเคราะห์ข้อมูลและทำนาย',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิเคราะห์', 'ทำนาย', 'ข้อมูล', 'รายงาน'],
                webUrl: 'https://www.akkio.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.akkio.com/'
            },
            {
                id: 'monkeylearn',
                name: 'MonkeyLearn',
                provider: 'MonkeyLearn',
                icon: 'fas fa-chart-bar',
                logoUrl: 'https://monkeylearn.com/favicon.ico',
                colorClass: 'monkeylearn',
                description: 'AI วิเคราะห์ข้อความในสเปรดชีต',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิเคราะห์ข้อความ', 'ข้อมูล', 'Excel', 'Google Sheets'],
                webUrl: 'https://monkeylearn.com/',
                mobileUrl: null,
                fallbackUrl: 'https://monkeylearn.com/'
            },
            {
                id: 'sourcetable',
                name: 'Sourcetable',
                provider: 'Sourcetable',
                icon: 'fas fa-table',
                logoUrl: 'https://sourcetable.com/favicon.ico',
                colorClass: 'sourcetable',
                description: 'AI ช่วยเชื่อมข้อมูลหลายแหล่งในสเปรดชีต',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เชื่อมข้อมูล', 'หลายแหล่ง', 'Excel', 'Google Sheets'],
                webUrl: 'https://sourcetable.com/',
                mobileUrl: null,
                fallbackUrl: 'https://sourcetable.com/'
            },
            {
                id: 'ai-office-bot',
                name: 'AI Office Bot',
                provider: 'AI Office Bot',
                icon: 'fas fa-robot',
                logoUrl: 'https://www.aiofficebot.com/favicon.ico',
                colorClass: 'officebot',
                description: 'AI ผู้ช่วยสำหรับ Office ทั้งหมด',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['Office', 'Excel', 'Word', 'PowerPoint'],
                webUrl: 'https://www.aiofficebot.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.aiofficebot.com/'
            },
            {
                id: 'excel-formula-gpt',
                name: 'Excel Formula GPT',
                provider: 'Excel Formula GPT',
                icon: 'fas fa-square-root-alt',
                logoUrl: 'https://excelformulagpt.com/favicon.ico',
                colorClass: 'excelgpt',
                description: 'AI ช่วยเขียนสูตร Excel ด้วยคำพูด',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สูตร Excel', 'เขียนด้วยคำพูด', 'ง่าย', 'รวดเร็ว'],
                webUrl: 'https://excelformulagpt.com/',
                mobileUrl: null,
                fallbackUrl: 'https://excelformulagpt.com/'
            }
        ]
    },
    {
        id: 'meeting',
        name: 'AI สรุปการประชุม',
        icon: 'fas fa-video',
        colorClass: 'category-meeting',
        description: 'AI สำหรับช่วยสรุปและจัดการการประชุม',
        ais: [
            {
                id: 'sembly-ai',
                name: 'Sembly AI',
                provider: 'Sembly',
                icon: 'fas fa-users',
                logoUrl: 'https://www.sembly.ai/favicon.ico',
                colorClass: 'sembly',
                description: 'AI สรุปการประชุมและวิเคราะห์',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สรุปประชุม', 'วิเคราะห์', 'บันทึก', 'หลายภาษา'],
                webUrl: 'https://www.sembly.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.sembly.ai/'
            },
            {
                id: 'supernormal',
                name: 'Supernormal',
                provider: 'Supernormal',
                icon: 'fas fa-star',
                logoUrl: 'https://supernormal.com/favicon.ico',
                colorClass: 'supernormal',
                description: 'AI สรุปการประชุมอัตโนมัติ',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['อัตโนมัติ', 'สรุปประชุม', 'บันทึก', 'หลายแพลตฟอร์ม'],
                webUrl: 'https://supernormal.com/',
                mobileUrl: null,
                fallbackUrl: 'https://supernormal.com/'
            },
            {
                id: 'tactiq',
                name: 'Tactiq',
                provider: 'Tactiq',
                icon: 'fas fa-comment-alt',
                logoUrl: 'https://tactiq.io/favicon.ico',
                colorClass: 'tactiq',
                description: 'AI ถอดเทปและสรุปการประชุม',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ถอดเทป', 'สรุปประชุม', 'Google Meet', 'Zoom'],
                webUrl: 'https://tactiq.io/',
                mobileUrl: null,
                fallbackUrl: 'https://tactiq.io/'
            },
            {
                id: 'meetgeek',
                name: 'MeetGeek',
                provider: 'MeetGeek',
                icon: 'fas fa-video',
                logoUrl: 'https://meetgeek.ai/favicon.ico',
                colorClass: 'meetgeek',
                description: 'AI บันทึกและสรุปการประชุม',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['บันทึก', 'สรุปประชุม', 'Zoom', 'Google Meet'],
                webUrl: 'https://meetgeek.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://meetgeek.ai/'
            },
            {
                id: 'tldv',
                name: 'tl;dv',
                provider: 'tl;dv',
                icon: 'fas fa-clock',
                logoUrl: 'https://tldv.io/favicon.ico',
                colorClass: 'tldv',
                description: 'AI บันทึกและไฮไลท์การประชุม',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ไฮไลท์', 'บันทึก', 'สรุป', 'Zoom', 'Google Meet'],
                webUrl: 'https://tldv.io/',
                mobileUrl: null,
                fallbackUrl: 'https://tldv.io/'
            },
            {
                id: 'colibri-ai',
                name: 'Colibri AI',
                provider: 'Colibri',
                icon: 'fas fa-feather-alt',
                logoUrl: 'https://colibri.ai/favicon.ico',
                colorClass: 'colibri',
                description: 'AI สรุปการประชุมและติดตามงาน',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สรุปประชุม', 'ติดตามงาน', 'หลายแพลตฟอร์ม', 'อัตโนมัติ'],
                webUrl: 'https://colibri.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://colibri.ai/'
            }
        ]
    },
    {
        id: 'workflow',
        name: 'AI ช่วยทำ Workflow / Automation',
        icon: 'fas fa-cogs',
        colorClass: 'category-workflow',
        description: 'AI สำหรับช่วยสร้างและจัดการเวิร์กโฟลว์อัตโนมัติ',
        ais: [
            {
                id: 'peltarion',
                name: 'Peltarion',
                provider: 'Peltarion',
                icon: 'fas fa-brain',
                logoUrl: 'https://peltarion.com/favicon.ico',
                colorClass: 'peltarion',
                description: 'แพลตฟอร์มสร้าง AI models และ automation',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['AI models', 'automation', 'machine learning', 'เวิร์กโฟลว์'],
                webUrl: 'https://peltarion.com/',
                mobileUrl: null,
                fallbackUrl: 'https://peltarion.com/'
            },
            {
                id: 'lindy-ai',
                name: 'Lindy AI',
                provider: 'Lindy',
                icon: 'fas fa-user-tie',
                logoUrl: 'https://www.lindy.ai/favicon.ico',
                colorClass: 'lindy',
                description: 'AI assistant สำหรับทำงานอัตโนมัติ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['AI assistant', 'automation', 'งานอัตโนมัติ', 'หลายงาน'],
                webUrl: 'https://www.lindy.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.lindy.ai/'
            },
            {
                id: 'bardeen-ai',
                name: 'Bardeen AI',
                provider: 'Bardeen',
                icon: 'fas fa-magic',
                logoUrl: 'https://bardeen.ai/favicon.ico',
                colorClass: 'bardeen',
                description: 'สร้าง automation ด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['automation', 'เวิร์กโฟลว์', 'อัตโนมัติ', 'หลายแอป'],
                webUrl: 'https://bardeen.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://bardeen.ai/'
            },
            {
                id: 'relay-app',
                name: 'Relay.app',
                provider: 'Relay',
                icon: 'fas fa-exchange-alt',
                logoUrl: 'https://relay.app/favicon.ico',
                colorClass: 'relay',
                description: 'สร้างเวิร์กโฟลว์ระหว่างแอป',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['เวิร์กโฟลว์', 'ระหว่างแอป', 'automation', 'หลายแพลตฟอร์ม'],
                webUrl: 'https://relay.app/',
                mobileUrl: null,
                fallbackUrl: 'https://relay.app/'
            },
            {
                id: 'uipath-ai',
                name: 'UiPath AI',
                provider: 'UiPath',
                icon: 'fas fa-robot',
                logoUrl: 'https://www.uipath.com/favicon.ico',
                colorClass: 'uipath',
                description: 'RPA และ AI สำหรับ automation',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['RPA', 'automation', 'AI', 'เวิร์กโฟลว์'],
                webUrl: 'https://www.uipath.com/product/ai',
                mobileUrl: null,
                fallbackUrl: 'https://www.uipath.com/product/ai'
            },
            {
                id: 'power-automate-copilot',
                name: 'Power Automate Copilot',
                provider: 'Microsoft',
                icon: 'fas fa-bolt',
                logoUrl: 'https://make.powerautomate.com/favicon.ico',
                colorClass: 'powerautomate',
                description: 'AI สำหรับสร้าง automation ใน Microsoft',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['Microsoft', 'automation', 'เวิร์กโฟลว์', 'Office 365'],
                webUrl: 'https://make.powerautomate.com/',
                mobileUrl: null,
                fallbackUrl: 'https://make.powerautomate.com/'
            }
        ]
    },
    {
        id: 'article',
        name: 'AI ช่วยเขียนบทความ',
        icon: 'fas fa-newspaper',
        colorClass: 'category-article',
        description: 'AI สำหรับช่วยเขียนบทความและเนื้อหา',
        ais: [
            {
                id: 'notion-ai',
                name: 'Notion AI',
                provider: 'Notion',
                icon: 'fas fa-cube',
                logoUrl: 'https://www.notion.so/favicon.ico',
                colorClass: 'notion',
                description: 'AI ช่วยเขียนและจัดการเนื้อหาใน Notion',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['Notion', 'เขียนเนื้อหา', 'สรุป', 'แปลภาษา'],
                webUrl: 'https://www.notion.so/product/ai',
                mobileUrl: 'notion://',
                fallbackUrl: 'https://www.notion.so/product/ai'
            },
            {
                id: 'anyword',
                name: 'Anyword',
                provider: 'Anyword',
                icon: 'fas fa-keyboard',
                logoUrl: 'https://anyword.com/favicon.ico',
                colorClass: 'anyword',
                description: 'AI ช่วยเขียนเนื้อหาเพื่อการตลาด',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['การตลาด', 'เขียนเนื้อหา', 'หลายภาษา', 'SEO'],
                webUrl: 'https://anyword.com/',
                mobileUrl: null,
                fallbackUrl: 'https://anyword.com/'
            },
            {
                id: 'hypotenuse-ai',
                name: 'Hypotenuse AI',
                provider: 'Hypotenuse',
                icon: 'fas fa-ruler-triangle',
                logoUrl: 'https://hypotenuse.ai/favicon.ico',
                colorClass: 'hypotenuse',
                description: 'AI ช่วยเขียนบทความและเนื้อหา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['บทความ', 'เนื้อหา', 'SEO', 'หลายภาษา'],
                webUrl: 'https://hypotenuse.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://hypotenuse.ai/'
            },
            {
                id: 'longshot-ai',
                name: 'LongShot AI',
                provider: 'LongShot',
                icon: 'fas fa-bullseye',
                logoUrl: 'https://longshot.ai/favicon.ico',
                colorClass: 'longshot',
                description: 'AI ช่วยเขียนบทความยาวและเนื้อหา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['บทความยาว', 'เนื้อหา', 'วิจัย', 'หลายภาษา'],
                webUrl: 'https://longshot.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://longshot.ai/'
            },
            {
                id: 'scalenut',
                name: 'Scalenut',
                provider: 'Scalenut',
                icon: 'fas fa-balance-scale',
                logoUrl: 'https://scalenut.com/favicon.ico',
                colorClass: 'scalenut',
                description: 'AI ช่วยเขียนและวิเคราะห์เนื้อหา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิเคราะห์', 'เขียนเนื้อหา', 'SEO', 'วิจัยคีย์เวิร์ด'],
                webUrl: 'https://scalenut.com/',
                mobileUrl: null,
                fallbackUrl: 'https://scalenut.com/'
            },
            {
                id: 'frase',
                name: 'Frase',
                provider: 'Frase',
                icon: 'fas fa-search',
                logoUrl: 'https://www.frase.io/favicon.ico',
                colorClass: 'frase',
                description: 'AI ช่วยเขียนและวิจัยเนื้อหา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิจัย', 'เขียนเนื้อหา', 'SEO', 'บทความ'],
                webUrl: 'https://www.frase.io/',
                mobileUrl: null,
                fallbackUrl: 'https://www.frase.io/'
            },
            {
                id: 'neuronwriter',
                name: 'NeuronWriter',
                provider: 'NeuronWriter',
                icon: 'fas fa-brain',
                logoUrl: 'https://neuronwriter.com/favicon.ico',
                colorClass: 'neuronwriter',
                description: 'AI ช่วยเขียนและ optimize เนื้อหา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['optimize', 'เขียนเนื้อหา', 'SEO', 'วิเคราะห์'],
                webUrl: 'https://neuronwriter.com/',
                mobileUrl: null,
                fallbackUrl: 'https://neuronwriter.com/'
            },
            {
                id: 'wordtune',
                name: 'Wordtune',
                provider: 'Wordtune',
                icon: 'fas fa-pen-fancy',
                logoUrl: 'https://www.wordtune.com/favicon.ico',
                colorClass: 'wordtune',
                description: 'AI ช่วยเขียนและปรับปรุงเนื้อหา',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ปรับปรุง', 'เขียนใหม่', 'เนื้อหา', 'หลายภาษา'],
                webUrl: 'https://www.wordtune.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.wordtune.com/'
            }
        ]
    },
    {
        id: 'schedule',
        name: 'AI ช่วยจัดตาราง / ช่วยทำงาน',
        icon: 'fas fa-calendar-alt',
        colorClass: 'category-schedule',
        description: 'AI สำหรับช่วยจัดการตารางเวลาและงาน',
        ais: [
            {
                id: 'sunsama',
                name: 'Sunsama',
                provider: 'Sunsama',
                icon: 'fas fa-sun',
                logoUrl: 'https://sunsama.com/favicon.ico',
                colorClass: 'sunsama',
                description: 'AI ช่วยจัดการงานและตารางเวลา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['จัดการงาน', 'ตารางเวลา', 'วัน', 'prioritize'],
                webUrl: 'https://sunsama.com/',
                mobileUrl: null,
                fallbackUrl: 'https://sunsama.com/'
            },
            {
                id: 'akiflow',
                name: 'Akiflow',
                provider: 'Akiflow',
                icon: 'fas fa-tasks',
                logoUrl: 'https://akiflow.com/favicon.ico',
                colorClass: 'akiflow',
                description: 'AI ช่วยจัดตารางและจัดการงาน',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['จัดตาราง', 'จัดการงาน', 'calendar', 'productivity'],
                webUrl: 'https://akiflow.com/',
                mobileUrl: null,
                fallbackUrl: 'https://akiflow.com/'
            },
            {
                id: 'timehero',
                name: 'TimeHero',
                provider: 'TimeHero',
                icon: 'fas fa-clock',
                logoUrl: 'https://timehero.com/favicon.ico',
                colorClass: 'timehero',
                description: 'AI ช่วยวางแผนและจัดการเวลา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วางแผน', 'จัดการเวลา', 'งาน', 'ตาราง'],
                webUrl: 'https://timehero.com/',
                mobileUrl: null,
                fallbackUrl: 'https://timehero.com/'
            },
            {
                id: 'skedpal',
                name: 'SkedPal',
                provider: 'SkedPal',
                icon: 'fas fa-calendar',
                logoUrl: 'https://skedpal.com/favicon.ico',
                colorClass: 'skedpal',
                description: 'AI ช่วยจัดตารางอัตโนมัติ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['จัดตารางอัตโนมัติ', 'เวลา', 'งาน', 'optimize'],
                webUrl: 'https://skedpal.com/',
                mobileUrl: null,
                fallbackUrl: 'https://skedpal.com/'
            },
            {
                id: 'serene',
                name: 'Serene',
                provider: 'Serene',
                icon: 'fas fa-spa',
                logoUrl: 'https://serene.app/favicon.ico',
                colorClass: 'serene',
                description: 'AI ช่วยโฟกัสและจัดการเวลา',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['โฟกัส', 'จัดการเวลา', 'productivity', 'ตาราง'],
                webUrl: 'https://serene.app/',
                mobileUrl: null,
                fallbackUrl: 'https://serene.app/'
            },
            {
                id: 'clara-ai',
                name: 'Clara AI',
                provider: 'Clara',
                icon: 'fas fa-user-tie',
                logoUrl: 'https://clara.com/favicon.ico',
                colorClass: 'clara',
                description: 'AI ผู้ช่วยจัดตารางนัดหมาย',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['นัดหมาย', 'จัดตาราง', 'ผู้ช่วย', 'อัตโนมัติ'],
                webUrl: 'https://clara.com/',
                mobileUrl: null,
                fallbackUrl: 'https://clara.com/'
            }
        ]
    },
    {
        id: 'notes',
        name: 'AI ช่วยบันทึก / จัดการข้อมูล',
        icon: 'fas fa-sticky-note',
        colorClass: 'category-notes',
        description: 'AI สำหรับช่วยบันทึกและจัดการข้อมูล',
        ais: [
            {
                id: 'obsidian-ai',
                name: 'Obsidian AI',
                provider: 'Obsidian',
                icon: 'fas fa-gem',
                logoUrl: 'https://obsidian.md/favicon.ico',
                colorClass: 'obsidian',
                description: 'AI สำหรับ note-taking app Obsidian',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เดสก์ท็อป', type: 'free' }
                ],
                features: ['note-taking', 'จัดความรู้', 'ลิงก์', 'คิด'],
                webUrl: 'https://obsidian.md/',
                mobileUrl: null,
                fallbackUrl: 'https://obsidian.md/'
            },
            {
                id: 'capacities',
                name: 'Capacities',
                provider: 'Capacities',
                icon: 'fas fa-brain',
                logoUrl: 'https://capacities.io/favicon.ico',
                colorClass: 'capacities',
                description: 'แพลตฟอร์มจัดการความรู้ด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['จัดการความรู้', 'note-taking', 'จัดระเบียบ', 'ค้นหา'],
                webUrl: 'https://capacities.io/',
                mobileUrl: null,
                fallbackUrl: 'https://capacities.io/'
            },
            {
                id: 'reflect-ai',
                name: 'Reflect AI',
                provider: 'Reflect',
                icon: 'fas fa-mirror',
                logoUrl: 'https://reflect.app/favicon.ico',
                colorClass: 'reflect',
                description: 'note-taking app กับ AI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['note-taking', 'ประจำวัน', 'จัดระเบียบ', 'ค้นหา'],
                webUrl: 'https://reflect.app/',
                mobileUrl: null,
                fallbackUrl: 'https://reflect.app/'
            },
            {
                id: 'tana-ai',
                name: 'Tana AI',
                provider: 'Tana',
                icon: 'fas fa-sitemap',
                logoUrl: 'https://tana.inc/favicon.ico',
                colorClass: 'tana',
                description: 'workspace สำหรับจัดการความรู้กับ AI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['จัดการความรู้', 'workspace', 'outliner', 'ค้นหา'],
                webUrl: 'https://tana.inc/',
                mobileUrl: null,
                fallbackUrl: 'https://tana.inc/'
            },
            {
                id: 'evernote-ai',
                name: 'Evernote AI',
                provider: 'Evernote',
                icon: 'fas fa-elephant',
                logoUrl: 'https://evernote.com/favicon.ico',
                colorClass: 'evernote',
                description: 'note-taking app แบบดั้งเดิมกับ AI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'มือถือ', type: 'mobile' }
                ],
                features: ['note-taking', 'จัดระเบียบ', 'ค้นหา', 'หลายแพลตฟอร์ม'],
                webUrl: 'https://evernote.com/',
                mobileUrl: 'evernote://',
                fallbackUrl: 'https://evernote.com/'
            }
        ]
    },
    {
        id: 'video',
        name: 'AI ช่วยสร้างวิดีโอ',
        icon: 'fas fa-video',
        colorClass: 'category-video',
        description: 'AI สำหรับช่วยสร้างและแก้ไขวิดีโอ',
        ais: [
            {
                id: 'synthesia',
                name: 'Synthesia',
                provider: 'Synthesia',
                icon: 'fas fa-user-tie',
                logoUrl: 'https://www.synthesia.io/favicon.ico',
                colorClass: 'synthesia',
                description: 'สร้างวิดีโอด้วย AI avatars',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['AI avatars', 'สร้างวิดีโอ', 'หลายภาษา', 'ไม่ต้องถ่าย'],
                webUrl: 'https://www.synthesia.io/',
                mobileUrl: null,
                fallbackUrl: 'https://www.synthesia.io/'
            },
            {
                id: 'heygen',
                name: 'HeyGen',
                provider: 'HeyGen',
                icon: 'fas fa-video',
                logoUrl: 'https://www.heygen.com/favicon.ico',
                colorClass: 'heygen',
                description: 'สร้างวิดีโอพูดด้วย AI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['พูด', 'สร้างวิดีโอ', 'หลายภาษา', 'AI avatars'],
                webUrl: 'https://www.heygen.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.heygen.com/'
            },
            {
                id: 'colossyan',
                name: 'Colossyan',
                provider: 'Colossyan',
                icon: 'fas fa-robot',
                logoUrl: 'https://www.colossyan.com/favicon.ico',
                colorClass: 'colossyan',
                description: 'สร้างวิดีโอด้วย AI actors',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['AI actors', 'สร้างวิดีโอ', 'หลายภาษา', 'corporate'],
                webUrl: 'https://www.colossyan.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.colossyan.com/'
            },
            {
                id: 'steve-ai',
                name: 'Steve AI',
                provider: 'Steve AI',
                icon: 'fas fa-magic',
                logoUrl: 'https://www.steve.ai/favicon.ico',
                colorClass: 'steve',
                description: 'สร้างวิดีโอจากข้อความหรือเสียง',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ข้อความเป็นวิดีโอ', 'เสียงเป็นวิดีโอ', 'หลายรูปแบบ', 'เทมเพลต'],
                webUrl: 'https://www.steve.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.steve.ai/'
            },
            {
                id: 'veed-ai',
                name: 'VEED AI',
                provider: 'VEED',
                icon: 'fas fa-edit',
                logoUrl: 'https://www.veed.io/favicon.ico',
                colorClass: 'veed',
                description: 'แก้ไขวิดีโอง่ายๆ ด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['แก้ไขวิดีโอ', 'อัตโนมัติ', 'หลายฟังก์ชัน', 'online'],
                webUrl: 'https://www.veed.io/',
                mobileUrl: null,
                fallbackUrl: 'https://www.veed.io/'
            },
            {
                id: 'opus-clip',
                name: 'Opus Clip',
                provider: 'Opus Clip',
                icon: 'fas fa-scissors',
                logoUrl: 'https://opus.pro/favicon.ico',
                colorClass: 'opus',
                description: 'AI ตัดต่อวิดีโออัตโนมัติ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ตัดต่อ', 'อัตโนมัติ', 'วิดีโอ', 'หลายรูปแบบ'],
                webUrl: 'https://opus.pro/',
                mobileUrl: null,
                fallbackUrl: 'https://opus.pro/'
            },
            {
                id: 'kapwing-ai',
                name: 'Kapwing AI',
                provider: 'Kapwing',
                icon: 'fas fa-video',
                logoUrl: 'https://www.kapwing.com/favicon.ico',
                colorClass: 'kapwing',
                description: 'สร้างและแก้ไขวิดีโอด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สร้างวิดีโอ', 'แก้ไข', 'หลายฟังก์ชัน', 'online'],
                webUrl: 'https://www.kapwing.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.kapwing.com/'
            },
            {
                id: 'vidyo-ai',
                name: 'Vidyo AI',
                provider: 'Vidyo',
                icon: 'fas fa-film',
                logoUrl: 'https://vidyo.ai/favicon.ico',
                colorClass: 'vidyo',
                description: 'AI ตัดต่อและ optimize วิดีโอ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ตัดต่อ', 'optimize', 'วิดีโอ', 'หลายแพลตฟอร์ม'],
                webUrl: 'https://vidyo.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://vidyo.ai/'
            }
        ]
    },
    {
        id: 'design',
        name: 'AI ออกแบบกราฟิก',
        icon: 'fas fa-paint-brush',
        colorClass: 'category-design',
        description: 'AI สำหรับช่วยออกแบบกราฟิกและ UI/UX',
        ais: [
            {
                id: 'figma-ai',
                name: 'Figma AI',
                provider: 'Figma',
                icon: 'fas fa-paint-brush',
                logoUrl: 'https://www.figma.com/favicon.ico',
                colorClass: 'figma',
                description: 'AI ใน Figma สำหรับออกแบบ UI/UX',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['UI/UX', 'ออกแบบ', 'prototype', 'collaboration'],
                webUrl: 'https://www.figma.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.figma.com/'
            },
            {
                id: 'galileo-ai',
                name: 'Galileo AI',
                provider: 'Galileo',
                icon: 'fas fa-satellite',
                logoUrl: 'https://www.usegalileo.ai/favicon.ico',
                colorClass: 'galileo',
                description: 'AI สร้าง UI จากข้อความ',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['UI จากข้อความ', 'ออกแบบ', 'หลายรูปแบบ', 'เร็ว'],
                webUrl: 'https://www.usegalileo.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://www.usegalileo.ai/'
            },
            {
                id: 'looka',
                name: 'Looka',
                provider: 'Looka',
                icon: 'fas fa-eye',
                logoUrl: 'https://looka.com/favicon.ico',
                colorClass: 'looka',
                description: 'AI ช่วยออกแบบโลโก้',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['โลโก้', 'ออกแบบ', 'branding', 'หลายสไตล์'],
                webUrl: 'https://looka.com/',
                mobileUrl: null,
                fallbackUrl: 'https://looka.com/'
            },
            {
                id: 'khroma',
                name: 'Khroma',
                provider: 'Khroma',
                icon: 'fas fa-palette',
                logoUrl: 'https://khroma.co/favicon.ico',
                colorClass: 'khroma',
                description: 'AI ช่วยเลือกสีสำหรับดีไซน์',
                badges: [
                    { text: 'ฟรี', type: 'free' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['สี', 'color palette', 'ออกแบบ', 'หลายรูปแบบ'],
                webUrl: 'https://khroma.co/',
                mobileUrl: null,
                fallbackUrl: 'https://khroma.co/'
            },
            {
                id: 'logoai',
                name: 'LogoAI',
                provider: 'LogoAI',
                icon: 'fas fa-signature',
                logoUrl: 'https://www.logoai.com/favicon.ico',
                colorClass: 'logoai',
                description: 'AI ช่วยสร้างโลโก้และ branding',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['โลโก้', 'branding', 'ออกแบบ', 'หลายสไตล์'],
                webUrl: 'https://www.logoai.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.logoai.com/'
            },
            {
                id: 'designs-ai',
                name: 'Designs.ai',
                provider: 'Designs.ai',
                icon: 'fas fa-palette',
                logoUrl: 'https://designs.ai/favicon.ico',
                colorClass: 'designsai',
                description: 'ครีเอทีฟ suite ทั้งหมดด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ครีเอทีฟ', 'ออกแบบ', 'โลโก้', 'วิดีโอ', 'เสียง'],
                webUrl: 'https://designs.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://designs.ai/'
            },
            {
                id: 'flair-ai',
                name: 'Flair AI',
                provider: 'Flair',
                icon: 'fas fa-sparkles',
                logoUrl: 'https://flair.ai/favicon.ico',
                colorClass: 'flair',
                description: 'AI ช่วยออกแบบภาพผลิตภัณฑ์',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ภาพผลิตภัณฑ์', 'ออกแบบ', 'branding', 'marketing'],
                webUrl: 'https://flair.ai/',
                mobileUrl: null,
                fallbackUrl: 'https://flair.ai/'
            }
        ]
    },
    {
        id: 'dataviz',
        name: 'AI ช่วยนำเสนอข้อมูลภาพ',
        icon: 'fas fa-chart-bar',
        colorClass: 'category-dataviz',
        description: 'AI สำหรับช่วยสร้างการแสดงข้อมูลแบบภาพ',
        ais: [
            {
                id: 'tableau-gpt',
                name: 'Tableau GPT',
                provider: 'Tableau',
                icon: 'fas fa-chart-pie',
                logoUrl: 'https://www.tableau.com/favicon.ico',
                colorClass: 'tableau',
                description: 'AI ใน Tableau สำหรับวิเคราะห์ข้อมูล',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิเคราะห์ข้อมูล', 'dashboard', 'visualization', 'business'],
                webUrl: 'https://www.tableau.com/products/ai-ml',
                mobileUrl: null,
                fallbackUrl: 'https://www.tableau.com/products/ai-ml'
            },
            {
                id: 'power-bi-copilot',
                name: 'Power BI Copilot',
                provider: 'Microsoft',
                icon: 'fas fa-chart-bar',
                logoUrl: 'https://app.powerbi.com/favicon.ico',
                colorClass: 'powerbi',
                description: 'AI ใน Power BI สำหรับวิเคราะห์ข้อมูล',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['วิเคราะห์ข้อมูล', 'dashboard', 'visualization', 'Microsoft'],
                webUrl: 'https://powerbi.microsoft.com/',
                mobileUrl: null,
                fallbackUrl: 'https://powerbi.microsoft.com/'
            },
            {
                id: 'polymer',
                name: 'Polymer',
                provider: 'Polymer',
                icon: 'fas fa-atom',
                logoUrl: 'https://www.polymersearch.com/favicon.ico',
                colorClass: 'polymer',
                description: 'สร้าง dashboard จากข้อมูลอัตโนมัติ',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['dashboard', 'อัตโนมัติ', 'visualization', 'ข้อมูล'],
                webUrl: 'https://www.polymersearch.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.polymersearch.com/'
            },
            {
                id: 'chartai',
                name: 'ChartAI',
                provider: 'ChartAI',
                icon: 'fas fa-chart-line',
                logoUrl: 'https://chartai.io/favicon.ico',
                colorClass: 'chartai',
                description: 'สร้าง chart และกราฟด้วย AI',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['chart', 'กราฟ', 'visualization', 'ข้อมูล'],
                webUrl: 'https://chartai.io/',
                mobileUrl: null,
                fallbackUrl: 'https://chartai.io/'
            },
            {
                id: 'thoughtspot-ai',
                name: 'ThoughtSpot AI',
                provider: 'ThoughtSpot',
                icon: 'fas fa-search',
                logoUrl: 'https://www.thoughtspot.com/favicon.ico',
                colorClass: 'thoughtspot',
                description: 'ค้นหาข้อมูลและสร้าง visualization',
                badges: [
                    { text: 'จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['ค้นหาข้อมูล', 'visualization', 'dashboard', 'business'],
                webUrl: 'https://www.thoughtspot.com/',
                mobileUrl: null,
                fallbackUrl: 'https://www.thoughtspot.com/'
            },
            {
                id: 'datawrapper-ai',
                name: 'Datawrapper AI',
                provider: 'Datawrapper',
                icon: 'fas fa-chart-area',
                logoUrl: 'https://www.datawrapper.de/favicon.ico',
                colorClass: 'datawrapper',
                description: 'สร้าง chart และแผนที่ด้วย AI',
                badges: [
                    { text: 'ฟรี/จ่าย', type: 'paid' },
                    { text: 'เว็บ', type: 'free' }
                ],
                features: ['chart', 'แผนที่', 'visualization', 'ข้อมูล'],
                webUrl: 'https://www.datawrapper.de/',
                mobileUrl: null,
                fallbackUrl: 'https://www.datawrapper.de/'
            }
        ]
    }
];