var api_key = "38fae460fb6f03c4197352a6b75762eb";
// https://api.followthemoney.org/?d-eid=1854&gro=c-t-id&APIKey=e880eb7ff2c4f269f950b55b157e46f1&mode=json&p=0

// credits: https://joshlevinson.me/2013/03/29/javascript-to-convert-between-states-and-abbreviations/

function convert_state(name, to) {
    var name = name.toUpperCase();
    var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
        {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
        {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'},
        {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
        {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
        {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
        {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
        {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
        {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
        {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
        {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
        {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
        {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
        {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
        {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
        {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
        {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'}
        );
    var returnthis = false;
    $.each(states, function(index, value){
        if (to == 'name') {
            if (value.abbrev == name){
                returnthis = value.name;
                return false;
            }
        } else if (to == 'abbrev') {
            if (value.name.toUpperCase() == name){
                returnthis = value.abbrev;
                return false;
            }
        }
    });
    return returnthis;
}

function pull_page(pageNo)
{
  var address = "https://api.followthemoney.org/?d-eid=1854&gro=c-t-id&APIKey=" + api_key + "&mode=json&p=" + pageNo;
  $.get(address, function (data, status) {
    var table = [];
    // console.log(data.records);
    var i;
    for(i = 0; i < data.records.length; i++)
    {
      var row = data.records[i];

      if (row.Election_Year != "2016")
        continue;

      // TODO: Fix couples
      // if &, disregard


      if (row.Candidate.Candidate.indexOf('&') != -1)
        continue;



      var record = {
        name: toTitleCase(row.Candidate.Candidate),
        namenicefied: toTitleCase(flip_comma(row.Candidate.Candidate)),
        money: row.Total_$.Total_$,
        state: convert_state( row.Election_Jurisdiction.Election_Jurisdiction,'name'),
        party: row.Specific_Party.Specific_Party
      };
      /*
      record.name = row.Candidate.Candidate;
      record.money = row.Total_$.Total_$;
      record.state = us_state_abbrev.get(row.Election_Jurisdiction.Election_Jurisdiction, "NA");
      record.party = row.Specific_Party.Specific_Party;
      */
      table.push(record);
    }
    console.log(table);
  });

}

function flip_comma (name) {
  if (name.indexOf(',') === -1)
    return name;
  else {
    var comma_pos = name.indexOf(',');
    var length = name.length;
    name = name.slice(comma_pos + 2, length) + " " + name.slice(0, comma_pos);
    return name;
  }
}

function standardizeName(name){
	var firstName;
	var lastName;
	var i;
	for (i = 0; i < name.length && name.charAt(i) !== " "; i++){
	}
	firstName = name.substring(0, i);
	if (i === name.length){
		lastName = "";
	}
	else{
		for (i = name.length - 1; i >= 0 && name.charAt(i) !== " "; i--){
		}
		lastName = name.substring(i, name.length);
	}
	return firstName + lastName;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var upper_limit = 90;
var lower_limit = 80;
var i;
for (i = upper_limit; i > lower_limit; i++)
{
  pull_page(i);
}
