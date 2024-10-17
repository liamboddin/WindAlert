<html lang="de">
<head>
    <meta charset="utf-8" />
    <title>WindAlert</title>
    <#include "mail-css.ftlh">
</head>
<body>
<main>
    <p>
        Guten Morgen!
    </p>
    <#list spots as spot>
        <p>
        Es gibt am Spot ${spot.spotName()} zu folgenden Zeiten Wind:
        <#list spot.windDates()>
            <ul>
                <#items as windDate>
                    <li>
                        ${windDate}
                    </li>
                </#items>
            </ul>
        </#list>
        </p>
    </#list>
    <p>
        Viel Spaß beim Kiten!
    </p>
</main>
</body>
</html>