function mergeBetweenTables(
  table,
  mergeWith,
  propertyName,
  mergeID,
  mergeData
) {
  const mergeMap = new Map();

  for (const { [mergeID]: id, [mergeData]: data } of mergeWith) {
    mergeMap.has(id) ? mergeMap.get(id).push(data) : mergeMap.set(id, [data]);
  }
  for (const row of table) {
    row[propertyName] = [];
    if (mergeMap.has(row[mergeID])) {
      row[propertyName] = [...mergeMap.get(row[mergeID])];
    }
  }
}

module.exports = {
  mergeBetweenTables,
};
