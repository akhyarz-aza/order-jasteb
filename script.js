// Data Paket Jasteb
const packages = [
    { amount: 150, price: 5000, type: "JASTEB" },
    { amount: 250, price: 10000, type: "JASTEB" },
    { amount: 450, price: 15000, type: "JASTEB" },
    { amount: 650, price: 20000, type: "JASTEB" },
    { amount: 1000, price: 30000, type: "JASTEB" },
    { amount: 1200, price: 40000, type: "JASTEB" },
    { amount: 1500, price: 50000, type: "JASTEB" }
];

let selectedPackage = null;
let selectedPaymentMethod = null;

// Nomor WhatsApp tujuan (ganti dengan nomor Anda)
const WA_NUMBER = "6283169894235";

// Fungsi format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
}

// Render paket ke grid
function renderPackages() {
    const grid = document.getElementById("packageGrid");
    grid.innerHTML = "";
    
    packages.forEach(pkg => {
        const card = document.createElement("div");
        card.className = "package-card";
        if (selectedPackage === pkg) card.classList.add("selected");
        
        card.innerHTML = `
            <div class="amount">${pkg.amount} JASTEB</div>
            <div class="price">${formatRupiah(pkg.price)}</div>
            <div class="type">${pkg.type}</div>
        `;
        
        card.addEventListener("click", () => {
            selectedPackage = pkg;
            renderPackages();
            updateTotal();
        });
        
        grid.appendChild(card);
    });
}

// Update total pembayaran
function updateTotal() {
    const totalElement = document.getElementById("totalPrice");
    const selectedPackElement = document.getElementById("selectedPack");
    
    if (selectedPackage) {
        totalElement.innerText = formatRupiah(selectedPackage.price);
        selectedPackElement.innerText = `${selectedPackage.amount} Jasteb - ${selectedPackage.type}`;
    } else {
        totalElement.innerText = "Rp 0";
        selectedPackElement.innerText = "Pilih paket untuk melihat detail";
    }
}

// Setup metode pembayaran
function setupPaymentMethods() {
    const methods = document.querySelectorAll(".method-btn");
    methods.forEach(btn => {
        btn.addEventListener("click", () => {
            methods.forEach(m => m.classList.remove("active"));
            btn.classList.add("active");
            selectedPaymentMethod = btn.getAttribute("data-method");
            
            let methodText = "";
            switch(selectedPaymentMethod) {
                case "dana": methodText = "💙 DANA"; break;
                case "qris": methodText = "📱 QRIS (Scan kode yang dikirim via WA)"; break;
            }
            document.getElementById("selectedMethod").innerHTML = `✅ Metode: ${methodText}`;
        });
    });
}

// Generate pesan WhatsApp
function generateWAMessage() {
    if (!selectedPackage) {
        alert("❌ Silakan pilih paket Jasteb terlebih dahulu!");
        return null;
    }
    
    if (!selectedPaymentMethod) {
        alert("❌ Silakan pilih metode pembayaran!");
        return null;
    }
    
    let metodeDisplay = "";
    switch(selectedPaymentMethod) {
        case "dana": metodeDisplay = "DANA"; break;
        case "qris": metodeDisplay = "QRIS"; break;
    }
    
    const message = `*ORDER JASTEB GACOR*
    
📦 Paket: ${selectedPackage.amount} Jasteb
💰 Harga: ${formatRupiah(selectedPackage.price)}
⭐ Tipe: ${selectedPackage.type}
💳 Metode Bayar: ${metodeDisplay}
⏱️ Proses: 1 Menit

📌 Bukti pembayaran akan saya kirim setelah transfer.
📌 No WhatsApp: ${WA_NUMBER}`;
    
    return encodeURIComponent(message);
}

// Kirim order via WA
function sendOrder() {
    const message = generateWAMessage();
    if (!message) return;
    
    const waLink = `https://wa.me/${WA_NUMBER}?text=${message}`;
    window.open(waLink, "_blank");
    
    // Tampilkan status sukses (simulasi)
    showSuccessStatus();
}

// Tampilkan status sukses setelah order
function showSuccessStatus() {
    if (selectedPackage) {
        document.getElementById("resultAmount").innerText = selectedPackage.amount;
    }
    const statusCard = document.getElementById("statusCard");
    statusCard.style.display = "block";
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        statusCard.style.display = "none";
    }, 5000);
}

// Event listener untuk tombol order
document.getElementById("orderBtn").addEventListener("click", sendOrder);

// Inisialisasi
function init() {
    renderPackages();
    setupPaymentMethods();
}

init();