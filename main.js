var xhttp = new XMLHttpRequest();

word = "poopypants";

queue = [];

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:
    response = xhttp.responseText;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(response,"text/xml");
    process(xmlDoc, word);
    define();
  }
};

function define() {
  if (queue.length) {
    word = queue.shift().trim();
    xhttp.open("GET", "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + word + "?key=9a80997f-cf84-4f49-8d2b-2e7fc5b529ca", true);
    xhttp.send();
  }
}

function process(xmlDoc) {
	// console.log(word);
  // console.log(xmlDoc);
  word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  wordrep = word.replace(/ /g,"_").replace(/'/g,"-")
  definitions = [];
	$(xmlDoc).find("dt").each(function() {
	  definitions = definitions.concat($(this).text().split(":"));
	});
  definitions = definitions.filter(v=>v!=''&&v!=' ');
  list = "<li class='def" + wordrep + "'><h3>"+ word +"</h3><div></div><a class='delete' onclick='remove(this)'>(remove)</a></li>";
  $("#glossary").append(list);
  select = "<select class='sel" + wordrep + "'></select>";
  $("li.def" + wordrep + ":last > div").append(select);
  definitions.forEach(function(a) {
    option = "<option>" + a + "</option>";
    $("select.sel" + wordrep + ":last").append(option);
  });
  
}

function submit() {
  words = $("#word").val().split(",").filter(v=>v!=''&&v!=' ');
  queue = queue.concat(words);
  define();
  $("#word").val("");
}

$("#submit").click(function() {
  submit();
});

$("#word").keypress(function(e) {
  if(e.which == 13) {
    submit();
  }
});

$("#create").click(function() {
  edit = "Glossary\n"
  $("#glossary > li").each(function() {
      console.log($(this).children("div").children("select option:selected"));
      edit += $(this).children("h3").text() + " - " + $(this).find("select option:selected").text() + "\n";
  });
  console.log(edit);
  $("textarea").text(edit);
});

$("#arrange").click(function() {
  var mylist = $("#glossary");
  var listitems = mylist.children('li').get();
  listitems.sort(function(a, b) {
     return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
  })
  $.each(listitems, function(idx, itm) { mylist.append(itm); });
});

$("#copy").click(function() {
  $("textarea").select();
  document.execCommand("copy");
  $("textarea").blur();
});

function remove(xd) {
  $(xd).parent().remove();
}
// &#10; Line Feed and &#13; Carriage Return