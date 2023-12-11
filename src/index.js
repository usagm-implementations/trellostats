const members = `https://api.trello.com/1/boards/9lLliFDX/members?key=f317767131a5a2a103060a00cf19863c&token=ATTAcfae20a2212af5dcfc9cfe509aa0ae7ea35824bd304329dd192e437127f0da4a26F45E7D`;
const allCards = `https://api.trello.com/1/boards/9lLliFDX/cards?key=f317767131a5a2a103060a00cf19863c&token=ATTAcfae20a2212af5dcfc9cfe509aa0ae7ea35824bd304329dd192e437127f0da4a26F45E7D`;
const allLists = `https://api.trello.com/1/boards/9lLliFDX/lists?key=f317767131a5a2a103060a00cf19863c&token=ATTAcfae20a2212af5dcfc9cfe509aa0ae7ea35824bd304329dd192e437127f0da4a26F45E7D`;
const axiosMethod = (url) => {
  try {
    return axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

let cbTable = document.getElementById("cbtable");
const getMembers = async (url) => {
  axiosMethod(url)
    .then(async (response) => {
      const listsResponse = await getLists(allLists);
      const boardLists = listsResponse;
      const cardsResponse = await getCards(allCards);
      const analytics = response.data.filter(
        (res) =>
          res.username == "sarahbryan16" ||
          res.username == "floces" ||
          res.username == "rashmeeprakash1"
      );
      cbTable.innerHTML = `<table class="table table-dark table-striped" id="memberTable">
                            <thead>
                              <tr>
                                <th class="align-middle text-center text-decoration-underline">User</th>
                                <th class="align-middle text-center text-decoration-underline">Lists</th>
                                <th class="align-middle text-center text-decoration-underline">Closed</th>
                              </tr>
                            </thead>
                            <tbody id="memberTBody">
                            </tbody>
                            <tfoot id="memberTFoot"></tfoot>
                          </table>
  `;
      let tBody = document.getElementById("memberTBody");
      let tFoot = document.getElementById("memberTFoot");
      for (const cb of analytics) {
        let usrnm;
        if (cb.username == "sarahbryan16") usrnm = "Sarah Bryan";
        if (cb.username == "floces") usrnm = "Cesar Floces";
        if (cb.username == "rashmeeprakash1") usrnm = "Rashmee Prakash";

        let listItemsHTML = "";
        let closedTrello = "";
        for (const list of boardLists) {
          const filteredData = cardsResponse.filter(
            (card) => card.idList == list.id && card.idMembers.includes(cb.id)
          );
          const monthBreak = groups(filteredData, "dateLastActivity");
          listItemsHTML += `<li id="${list.id}-${
            cb.id
          }" class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark p-1">
          ${list.name}
          <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${
            list.id
          }-${cb.id}" aria-expanded="false" aria-controls="collapse-${
            list.id
          }-${cb.id}">
          <span class="badge bg-primary">${filteredData.length}</span>
          </button>
        </li>
        <div class="collapse" id="collapse-${list.id}-${cb.id}">
        <ul class="list-group list-group-flush">
          ${generateMonthList(Object.entries(monthBreak))}
        </ul>
        </div>`;
        }
        const closedItems = cardsResponse.filter((item) =>
          item.labels.some(
            (label) =>
              label.name === "Closed/Completed" &&
              item.idMembers.includes(cb.id)
          )
        );
        let closedLI = groups(closedItems, "dateLastActivity");
        closedTrello += `
          <ul class="list-group list-group-flush">
            ${generateMonthList(Object.entries(closedLI))}
          </ul>
        `;

        tBody.innerHTML += `<tr>
                            <td class="align-middle text-center">${usrnm}</td>
                            <td id="list" class="list"><ul id="${cb.id}" class="list-group theUL">${listItemsHTML}</ul></td>
                            <td id="${cb.id}_closed">${closedTrello}</td>
                           </tr>`;
      }
      const closedTotal = cardsResponse.filter((item) =>
        item.labels.some((label) => label.name === "Closed/Completed")
      );
      tFoot.innerHTML += `<tr>
                            <th class="align-middle text-center">Total</th>
                            <th><h2><span class="badge bg-success float-end">${cardsResponse.length}</span></h2></th>
                            <th><h2><span class="badge bg-success float-end">${closedTotal.length}</span></h2></th>
                          </tr>`;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getLists = async (url) => {
  try {
    const response = await axiosMethod(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCards = async (url) => {
  try {
    const response = await axiosMethod(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const generateMonthList = (months) => {
  return months
    .map(
      ([month, value]) => `
  <li class="list-group-item d-flex justify-content-between align-items-center">
    ${month}
    <span class="badge bg-info rounded-pill">${value.length}</span>
  </li>
`
    )
    .join("");
};

const groups = (res, dateVal) => {
  const groupedByMonth = res.reduce((result, item) => {
    const date = new Date(item[dateVal]);
    const monthYearKey = `${date.toLocaleString("en-US", {
      month: "long",
    })} ${date.getFullYear()}`;

    result[monthYearKey] = result[monthYearKey] || [];
    result[monthYearKey].push(item);

    return result;
  }, {});

  // Sort the keys (month-year) and create an array of sorted groups
  const sortedGroups = Object.entries(groupedByMonth)
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
  return sortedGroups;
};
getMembers(members);
