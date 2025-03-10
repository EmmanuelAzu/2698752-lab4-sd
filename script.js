document.getElementById("submit").addEventListener("click", async () => {
    const countryName = document.getElementById("country").value;

    if (!countryName) {
        alert("Please enter a country name");
        return;
    }

    const countryInfoUrl = `https://restcountries.com/v3.1/name/${countryName}`;

    try {
        
        const response = await fetch(countryInfoUrl);
        if (!response.ok) {
            throw new Error("Country not found");
        }
        const data = await response.json();
        const countryData = data[0]; 

        document.getElementById("country-info").innerHTML = `
            <h2>${countryData.name.common}</h2>
           
             <li><p>Capital: ${countryData.capital ? countryData.capital[0] : "N/A"}</p></li>
            <li><p>Population: ${countryData.population}</p></li>
            <li><p>Region: ${countryData.region}</p></li>
            <li><p>Flag: <img src="${countryData.flags.png}"/></p></li>
            

        `;

        
        if (countryData.borders) {
            const borderingCountries = await Promise.all( //makes sure every country's data is fetched at once
                countryData.borders.map(async (borderCode) => { 
                    const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                    const borderData = await borderResponse.json();
                    const flag_url= borderData[0].flags.png;
                    const flag_name = borderData[0].name.common;
                    return [flag_name, flag_url];
                })
            );
            document.getElementById("bordering-countries").innerHTML = `
                <h3>Bordering Countries:</h3>
                <ul>
                    ${borderingCountries.map(country => `<li>${country[0]}: <img src="${country[1]}"/></li>`).join("")}
                </ul>
            `;
        } else {
            document.getElementById("bordering-countries").innerHTML = "<h3>No bordering countries found.</h3>";
        }
    } catch (error) {
        document.getElementById("country-info").innerHTML = `<p>Error: ${error.message}</p>`;
        document.getElementById("bordering-countries").innerHTML = "";
    }
});
