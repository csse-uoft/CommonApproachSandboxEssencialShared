const {createGraphDBModel, Types} = require("graphdb-utils");

const GDBUnitOfMeasure = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
}, {
  rdfTypes: ['iso21972:Unit_of_measure'], name: 'unit_of_measure'
})

const GDBMeasureModel = createGraphDBModel({
  numericalValue: {type: String, internalKey: 'iso21972:numerical_value'}
}, {
  rdfTypes: ['iso21972:Measure'], name: 'measure'
});

module.exports = {
  GDBMeasureModel, GDBUnitOfMeasure
}