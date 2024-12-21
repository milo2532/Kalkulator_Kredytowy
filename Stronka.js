
let chart; // Zmienna globalna do przechowywania instancji wykresu

function obliczRate() {
    const kwotaInput = document.getElementById("kwota");
    const iloscRatInput = document.getElementById("iloscRat");
    const oprocentowanieInput = document.getElementById("oprocentowanie");
    const prowizjaInput = document.getElementById("prowizja");

    // Reset stylów i walidacja
    kwotaInput.style.borderColor = "";
    iloscRatInput.style.borderColor = "";
    oprocentowanieInput.style.borderColor = "";
    prowizjaInput.style.borderColor = "";

    const kwota = parseFloat(kwotaInput.value);
    const iloscRat = parseInt(iloscRatInput.value);
    const oprocentowanie = parseFloat(oprocentowanieInput.value) / 100 / 12;
    const prowizja = parseFloat(prowizjaInput.value) / 100;
    const rodzajRat = document.getElementById("rodzajRat").value;

    let isValid = true;
    if (!kwota || kwota <= 0) {
        kwotaInput.style.borderColor = "red";
        isValid = false;
    }
    if (!iloscRat || iloscRat <= 0) {
        iloscRatInput.style.borderColor = "red";
        isValid = false;
    }
    if (isNaN(oprocentowanie) || oprocentowanie <= 0) {
        oprocentowanieInput.style.borderColor = "red";
        isValid = false;
    }
    if (isNaN(prowizja) || prowizja < 0) {
        prowizjaInput.style.borderColor = "red";
        isValid = false;
    }

    if (!isValid) {
        alert("Proszę wprowadzić prawidłowe wartości.");
        return;
    }

    const kwotaPoProwizji = kwota * (1 + prowizja);
    let rata, calkowiteOdsetki;

    if (rodzajRat === "stale") {
        rata = (kwotaPoProwizji * oprocentowanie) / (1 - Math.pow(1 + oprocentowanie, -iloscRat));
        calkowiteOdsetki = rata * iloscRat - kwotaPoProwizji;
    } else {
        let pozostalaKwota = kwotaPoProwizji;
        calkowiteOdsetki = 0;
        for (let i = 0; i < iloscRat; i++) {
            let odsetkiMiesieczne = pozostalaKwota * oprocentowanie;
            calkowiteOdsetki += odsetkiMiesieczne;
            pozostalaKwota -= kwotaPoProwizji / iloscRat;
        }
        rata = kwotaPoProwizji / iloscRat + kwotaPoProwizji * oprocentowanie;
    }

    document.getElementById("rata").innerText = rata.toFixed(2);

    const prowizjaKwotowa = kwota * prowizja;
    const calkowitaKwota = kwota + calkowiteOdsetki + prowizjaKwotowa;

    document.getElementById("podsumowanie").innerHTML = `
        <p><strong>Podsumowanie:</strong></p>
        <p>Kwota kredytu: ${kwota.toFixed(2)} PLN</p>
        <p>Prowizja: ${prowizjaKwotowa.toFixed(2)} PLN</p>
        <p>Całkowite odsetki: ${calkowiteOdsetki.toFixed(2)} PLN</p>
        <p>Łączna kwota do spłaty: ${calkowitaKwota.toFixed(2)} PLN</p>
    `;

    const ctx = document.getElementById('wykresKolo').getContext('2d');

    // Sprawdzanie, czy wykres już istnieje, aby go zniszczyć przed stworzeniem nowego
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Kwota kredytu', 'Prowizja', 'Odsetki'],
            datasets: [{
                data: [kwota, prowizjaKwotowa, calkowiteOdsetki],
                backgroundColor: ['#007bff', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}
