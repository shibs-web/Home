
const SHIBS_PROJECTS = [
    {
        id: "doctorlog",
        name: "DoctorLog — سجل الطبيب",
        description: "نظام إدارة العيادات الطبية",
        currency: "ل.س",
        plans: [
            {
                id: "discounted",
                name: "اشتراك مخفّض",
                basePrice: 675,
                pricePerUser: 135,
                pricePerDevice: 70,
                includedUsers: 1,
                includedDevices: 1,
                features: [
                    "إدارة المواعيد والمرضى",
                    "فوترة أساسية"
                ]
            },
            {
                id: "fair",
                name: "اشتراك عادل",
                basePrice: 1125,
                pricePerUser: 135,
                pricePerDevice: 70,
                includedUsers: 3,
                includedDevices: 2,
                features: [
                    "تحصل على كل خدمات البرنامج",
                    "دعم بأولوية"
                ]
            },
            {
                id: "support",
                name: "اشتراك داعم",
                basePrice: 1350,
                pricePerUser: 135,
                pricePerDevice: 70,
                includedUsers: 3,
                includedDevices: 2,
                features: [
                    "تحصل على كل خدمات البرنامج",
                    "لوحة تحكم متقدمة وتقارير",
                    " دعم الايميل او الواتس اب رجال الاعمال المباشرين",
                    "دعم بأولوية"
                ]
            }
        ]
    },
    {
        id: "marketlog",
        name: "MarketLog — سجل التاجر",
        description: "نظام فوترة وإدارة مخزون للمحال التجارية",
        currency: "ل.س",
        plans: [
            {
                id: "basic",
                name: "أساسي",
                basePrice: 675,
                pricePerUser: 135,
                pricePerDevice: 70,
                includedUsers: 1,
                includedDevices: 1,
                features: [
                    "فوترة بقارئ الباركود",
                    "تتبع المخزون",
                    "تقارير أساسية"
                ]
            },
            {
                id: "pro",
                name: "احترافي",
                basePrice: 1350,
                pricePerUser: 135,
                pricePerDevice: 70,
                includedUsers: 3,
                includedDevices: 2,
                features: [
                    "كل ميزات الخطة الأساسية",
                    "إدارة الموردين وسندات الاستلام",
                    "دعم بأولوية"
                ]
            }
        ]
    }
];
