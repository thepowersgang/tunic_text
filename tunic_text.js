LIST_OUTER = [
  0x07, 0x06, 0x18, 0x1C, 0x0C, 0x03,
  0x1E, 0x0F, 0x1D, 0x17, 0x1B, 0x16,
  0x02, 0x01, 0x08, 0x10, 0x1F, 0x14,
];
LIST_INNER = [
  0x50, 0x54, 0x7F, 0x29, 0x4A, 0x2D,
  0x5A, 0x4B, 0x69, 0x1A, 0x2C, 0x39,
  0x4E, 0x2F, 0x7A, 0x3B, 0x6E, 0x7D,
  0x5F, 0x6A, 0x2B, 0x2E, 0x05, 0x2A,
];
KEYS_OUTER = [
 'Q', 'W', 'E', 'R', 'T', 'Y',
 'A', 'S', 'D', 'F', 'G', 'H',
 'Z', 'X', 'C', 'V', 'B', 'N',
 ];
KEYS_INNER = [
 '1', '2', '3', '4', '5', '6',
 'q', 'w', 'e', 'r', 't', 'y',
 'a', 's', 'd', 'f', 'g', 'h',
 'z', 'x', 'c', 'v', 'b', 'n',
 ];

W = 20;
H = 30;
function line(ctx, bx, by, scale, x0,y0, x1,y1, colour) {
	SX = W*scale / 2;
	SY = H*scale / 5;

  ctx.strokeStyle = colour;

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(bx + SX*x0, by + SY*y0);
	ctx.lineTo(bx + SX*x1, by + SY*y1);
	ctx.stroke();
}
function draw_character_raw(ctxt, x, y, c, scale, colours) {
  c0 = colours[0];
	c1 = colours[1];
	c2 = colours[2];

	if(c.o_tr) line(ctx, x,y,scale, 2,1, 1,0, c1);
	if(c.o_tl) line(ctx, x,y,scale, 1,0, 0,1, c1);
	if(c.o_l ) line(ctx, x,y,scale, 0,1, 0,4, c1);
	if(c.o_bl) line(ctx, x,y,scale, 0,4, 1,5, c1);
	if(c.o_br) line(ctx, x,y,scale, 1,5, 2,4, c1);

	if(c.i_tl) line(ctx, x,y,scale, 0,1, 1,2, c2);
	if(c.i_tm) line(ctx, x,y,scale, 1,0, 1,2, c2);
	if(c.i_tr) line(ctx, x,y,scale, 2,1, 1,2, c2);
	if(c.i_tm || c.i_bm) line(ctx, x,y,scale, 1,2, 1,3, c2);
	if(c.i_bl) line(ctx, x,y,scale, 0,4, 1,3, c2);
	if(c.i_bm) line(ctx, x,y,scale, 1,5, 1,3, c2);
	if(c.i_br) line(ctx, x,y,scale, 2,4, 1,3, c2);

  if(c.swap) {
    ctx.strokeStyle = c0;
    ctx.beginPath();
    r = 0.25;
    ctx.arc(x + W*scale/2, y + H*scale * (5-r)/5, r/5*scale*H, 0, 2*Math.PI);
    ctx.stroke();
  }
}
function draw_character(ctx, x, y, c, scale=1.0, is_render=false) {
  if( is_bw() && is_render ) {
    draw_character_raw(ctx, x, y, c, scale, ["#000","#000","#000"]);
    SY = H*scale/5;
    LW = 2;
    DY = (LW/2) / SY;
    line(ctx, x,y,scale, -0.1,2.5+DY, 2.0,2.5+DY, "#FFF");
    line(ctx, x,y,scale, -0.1,2.5   , 2.0,2.5   , "#000");
  }
  else {
    draw_character_raw(ctx, x, y, new Character(0xff,0xff,1), scale, ["#EEE", "#EEE", "#EEE"]);
    draw_character_raw(ctx, x, y, c, scale, ["#000000", "#FF0000", "#0000FF"]);
  }
}
function is_bw() {
  return document.getElementById("output-bw").checked;
}

class Character {
  constructor(ov=0,iv=0,swap=false) {
    this.verbatim_text = "";
    this.swap = swap;
    this.set_outer_value(ov);
    this.set_inner_value(iv);
  }
  clone() {
    var rv = new Character(this.outer_value(), this.inner_value(), this.swap);
    rv.verbatim_text = this.verbatim_text;
    return rv;
  }
  outer_value() {
    var v = 0;
    if(this.o_tr) v |= 1;
    if(this.o_tl) v |= 2;
    if(this.o_l ) v |= 4;
    if(this.o_bl) v |= 8;
    if(this.o_br) v |= 16;
    return v;
  }
  set_outer_value(v) {
   this.o_tr = (v & 0x01) != 0;
   this.o_tl = (v & 0x02) != 0;
   this.o_l  = (v & 0x04) != 0;
   this.o_bl = (v & 0x08) != 0;
   this.o_br = (v & 0x10) != 0;
  }
  inner_value() {
    var v = 0;
    if(this.i_tr) v |= 1;
    if(this.i_tm) v |= 2;
    if(this.i_tl) v |= 4;
    if(this.i_bm || this.i_tm) v |= 8;
    if(this.i_bl) v |= 0x10;
    if(this.i_bm) v |= 0x20;
    if(this.i_br) v |= 0x40;
    return v;
  }
  set_inner_value(v) {
   this.i_tr = (v & 0x01) != 0;
   this.i_tm = (v & 0x02) != 0;
   this.i_tl = (v & 0x04) != 0;
   //this.i_m  = (v & 0x08) != 0;
   this.i_bl = (v & 0x10) != 0;
   this.i_bm = (v & 0x20) != 0;
   this.i_br = (v & 0x40) != 0;
  }
  is_blank() {
    if(this.verbatim_text != "")
      return false;
    return this.outer_value() == 0 && this.inner_value() == 0;
  }
  outer_phoneme() {
    var v = OUTER_MAPPING[this.outer_value()];
    return v === undefined ? "[]" : v;
  }
  inner_phoneme() {
    var v = INNER_MAPPING[this.inner_value()];
    return v === undefined ? "[]" : v;
  }
  get_phoneme_pair() {
   if(this.verbatim_text != "") return this.verbatim_text;
   if( this.is_blank() ) {
     return " ";
   }
   if( this.swap ) {
     return this.outer_phoneme() + this.inner_phoneme();
   }
   else {
     return this.inner_phoneme() + this.outer_phoneme();
   }
  }
  encode() {
    if(this.verbatim_text != "" ) {
      return "'"+this.verbatim_text+"'";
    }
    if( this.is_blank() ) {
      return " ";
    }
    return this.inner_value() + (this.swap ? "/" : "-") + this.outer_value();
  }
  decode_from(s) {
    if( s[0] == '\'') {
      s = s.substring(1, s.length - 1);
      this.verbatim_text = s;
    }
    else if(s != " ") {
      var v = s.split('--');
      if(v.length == 1) {
        v = s.split('-');
      }
      if(v.length == 2) {
        this.swap = false;
      }
      else {
        v = s.split('/');
        this.swap = true;
      }
      this.set_inner_value(0 + v[0]);
      this.set_outer_value(0 + v[1]);
   }
   else {
    this.verbatim_text = "";
    this.swap = false;
   }
  }
}

function update_entry(ch) {
  canvas = document.getElementById("entry");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var scale = 10.0;
  {
    if( document.getElementById('input_mode-text').checked )
    {
      // No draw
    }
    else
    {
	    var SX = W*scale / 2;
	    var SY = H*scale / 5;
      if( document.getElementById('input_mode-strokes').checked )
      {
        ctx.fillText("1", SX*0.5  , SY*0.5-5);
        ctx.fillText("2", SX*1.0+5, SY*0.5  );
        ctx.fillText("3", SX*1.5  , SY*0.5-5);

        ctx.fillText("Q", SX*0.5  , SY*1.5-5);
        ctx.fillText("E", SX*1.5  , SY*1.5-5);
        
        ctx.fillText("A", SX*0.0+5, SY*2.5  );

        ctx.fillText("S", SX*0.5  , SY*3.5-5);
        ctx.fillText("D", SX*1.5  , SY*3.5-5);

        ctx.fillText("Z", SX*0.5  , SY*4.5+10);
        ctx.fillText("X", SX*1.0+5, SY*4.5  );
        ctx.fillText("C", SX*1.5  , SY*4.5+10);

        ctx.fillText("F", SX*1.0-9, SY*4.75);
      }
      else if( document.getElementById('input_mode-glyphs').checked )
      {
        ctx.fillText("J", SX*1.0-9, SY*4.75);
      }
      draw_character(ctx, 0, 0, ch, scale);
    }
  }
  document.getElementById("current").innerHTML = ch.get_phoneme_pair() + "&nbsp;";
}
var insert_pos = 0;
var text = [];
function commit_char(ch) {
  if(insert_pos % 2 == 0) {
    text.splice(insert_pos/2|0, 0, ch);
  }
  else {
    text[insert_pos/2|0] = ch;
  }
  insert_pos += 2;
  insert_pos = (insert_pos/2|0)*2;
  if( insert_pos > text.length*2 ) {
    insert_pos = text.length*2;
  }
  update_rendered();
}
function update_rendered() {
  output = "";
  encoded = "";

  canvas = document.getElementById("rendered");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x = 2;
  y = 2;
  var prev_blank = false;
  var char_positions = [];
  var char_widths = [];
  ctx.font = (H/2|0)+"px Arial";
  for(i in text) {
    c = text[i];
    // If we've reached a non-blank character, and will be overflowing the canvas - newline
    if( !c.is_blank() ) {
      var w;
      if( c.verbatim_text != "" ) {
        txt_size = ctx.measureText(c.verbatim_text);
        w = txt_size.width;
      }
      else {
        w = (W+2);
      }
      if( x+w >= canvas.width ) {
        x = 2;
        y += H+2;
      }
    }
    // Save the position
    char_positions.push([x,y]);
    if( !c.is_blank() ) {
      // Draw a non-blank character
      if( c.verbatim_text != "" ) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        txt_size = ctx.measureText(c.verbatim_text);
        ctx.fillText(c.verbatim_text, x, y+H-3);
        x += txt_size.width;
        console.log(c.verbatim_text, txt_size);
      }
      else {
        draw_character(ctx, x, y, c, 1.0, true);
        x += W;
        if( ! is_bw() ) {
          x += 2;
        }
      }
    }
    else {
      x += W/2;
    }
    if( i*2 == insert_pos ) {
      output += '|';
    }
    if( i*2 + 1 == insert_pos ) {
      output += '<u>'
    }
    output += c.get_phoneme_pair();
    if( i*2 + 1 == insert_pos ) {
      output += '</u>'
    }
    output += ":";
    encoded += c.encode() + ",";
    char_widths.push( x - char_positions[char_positions.length-1][0] );
    if(c.is_blank() && prev_blank) {
      x = 2;
      y += H+2;
      output += "<br/>";
    }
    prev_blank = c.is_blank();
  }
  char_positions.push([x,y]);
  if(text.length * 2 == insert_pos ) {
    output += '|';
  }
  document.getElementById("phonetic").innerHTML = output + "&nbsp;";
  history.replaceState(undefined, undefined, "#" + encoded);

  document.getElementById("translated").innerHTML = translate(output) + "&nbsp;";

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  x = char_positions[insert_pos/2|0][0];
  y = char_positions[insert_pos/2|0][1];
  ctx.moveTo(x,y + H);
  if( insert_pos % 2 == 0 ) {
	  ctx.lineTo(x, y);
  }
  else {
	  ctx.lineTo(x + char_widths[(insert_pos/2|0)], y + H);
  }
  ctx.stroke();
}
function translate(text) {
  text = text.replace("<u>", "");
  text = text.replace("</u>", "");
  text = text.replace("|", "");
  ents = text.split(" :");
  var rv = "";
  for(i in ents) {
    e = ents[i].substring(0, ents[i].length-1);
    if(e.length >= 5 && e.substring(0, 5) == "<br/>") {
      rv += "<br/>";
      e = e.substring(5);
    }
    if(e.length >= 1 && e[e.length-1] == ':' ) {
      e = e.substring(0, e.length-1);
    }
    var v = TRANSLATIONS[ e ];
    if( v == undefined ) {
      rv += e;
    }
    else {
     rv += v;
    }
    rv += " ";
  }
  return rv;
}

var current_ch = new Character();
function handle_keyboard_event(ev) {
  // Space: Commit the current character and move on
  if( ev.key == ' ' ) {
    commit_char(current_ch);
    current_ch = new Character();
    update_entry(current_ch);
    return
  }
  // Backtick: Switch modes
  if( ev.key == '`' && (!document.getElementById('input_mode-text').checked || current_ch.is_blank()) ) {
    if( document.getElementById('input_mode-strokes').checked ) {
      document.getElementById('input_mode-glyphs').checked = true;
    }
    else if( document.getElementById('input_mode-glyphs').checked ) {
      document.getElementById('input_mode-strokes').checked = true;
    }
    else {
      // Fallback
      document.getElementById('input_mode-strokes').checked = true;
    }
    document.getElementById('input_mode-text').checked = false;
    update_entry(current_ch);
    return;
  }
  if( ev.key == '~' && current_ch.is_blank() ) {
    document.getElementById('input_mode-text').checked = !document.getElementById('input_mode-text').checked;
    update_entry(current_ch);
    return;
  }
  if( ev.key == '0' ) {
    document.getElementById('output-bw').checked = !document.getElementById('output-bw').checked;
    update_rendered();
    update_entry(current_ch);
    return;
  }

  // Raw text mode: Append to the verbatim text
  if( document.getElementById('input_mode-text').checked )
  {
    current_ch.verbatim_text += ev.key;
  }
  else
  {
    // Stroke input mode: Toggle the status of various strokes
    if( document.getElementById('input_mode-strokes').checked )
    {
      if( ev.key == '1' ) { current_ch.o_tl = !current_ch.o_tl; }
      if( ev.key == '2' ) { current_ch.i_tm = !current_ch.i_tm; }
      if( ev.key == '3' ) { current_ch.o_tr = !current_ch.o_tr; }

      if( ev.key == 'q' ) { current_ch.i_tl = !current_ch.i_tl; }
      //if( ev.key == 'w' ) { current_ch.i_m  = !current_ch.i_m ; }
      if( ev.key == 'e' ) { current_ch.i_tr = !current_ch.i_tr; }

      if( ev.key == 'a' ) { current_ch.o_l  = !current_ch.o_l ; }
      if( ev.key == 's' ) { current_ch.i_bl = !current_ch.i_bl; }
      if( ev.key == 'd' ) { current_ch.i_br = !current_ch.i_br; }

      if( ev.key == 'z' ) { current_ch.o_bl = !current_ch.o_bl; }
      if( ev.key == 'x' ) { current_ch.i_bm = !current_ch.i_bm; }
      if( ev.key == 'c' ) { current_ch.o_br = !current_ch.o_br; }

      if( ev.key == 'f' ) { current_ch.swap = !current_ch.swap; }
    }
    // Glyph input mode: Set glyph components using hotkeys
    if( document.getElementById('input_mode-glyphs').checked )
    {
      if( ev.key == 'j' ) { current_ch.swap = !current_ch.swap; }
      for(i in KEYS_OUTER) {
        if( ev.key == KEYS_OUTER[i] ) {
          if( current_ch.outer_value() == LIST_OUTER[i]) {
            current_ch.set_outer_value(0);
          }
          else {
            current_ch.set_outer_value(LIST_OUTER[i]);
          }
        }
      }
      for(i in KEYS_INNER) {
        if( ev.key == KEYS_INNER[i] ) {
          console.log(ev.key, LIST_INNER[i]);
          if( current_ch.inner_value() == LIST_INNER[i]) {
            current_ch.set_inner_value(0);
          }
          else {
            current_ch.set_inner_value(LIST_INNER[i]);
          }
        }
      }
    }
  }

  update_entry(current_ch);
}
function update_current_with_cursor() {
  if( insert_pos % 2 == 1 ) {
    current_ch = text[insert_pos/2|0].clone();
  }
  else {
    current_ch = new Character();
  }
  if( !current_ch.is_blank() ) {
    document.getElementById('input_mode-text').checked = (current_ch.verbatim_text != "");
  }
  update_entry(current_ch);
  update_rendered();
}
function handle_keyboard_event_down(ev) {
  ev = ev || window.event;
  // left arrow
  if( ev.keyCode == '37' ) {
    if( insert_pos > 0) {
      insert_pos -= 1;
      update_current_with_cursor();
    }
    return;
  }
  // right arrow
  if( ev.keyCode == '39' ) {
    if( insert_pos < text.length*2 ) {
      insert_pos += 1;
      update_current_with_cursor();
    }
    return;
  }

  if( ev.key == 'Delete' ) {
    if( insert_pos % 2 == 1 ) {
      insert_pos -= 1;
      text.splice(insert_pos/2, 1);
    }
    else {
      if( insert_pos / 2 < text.length ) {
        text.splice(insert_pos/2, 1);
      }
    }
    update_current_with_cursor();
    return;
  }

  if( ev.key == 'Backspace' ) {
    if( document.getElementById('input_mode-text').checked && current_ch.verbatim_text != "" ) {
      current_ch.verbatim_text = current_ch.verbatim_text.substring(0, current_ch.verbatim_text.length - 1);
      update_entry(current_ch);
      return;
    }

    console.log(insert_pos);
    if( insert_pos % 2 == 1 ) {
      insert_pos -= 1;
      console.log("remove");
      text.splice(insert_pos/2, 1);
    }
    else {
      console.log("backspace");
      if( insert_pos > 0 ) {
        insert_pos -= 2;
        text.splice(insert_pos/2, 1);
      }
    }
    update_current_with_cursor();
    return;
  }

  //console.log("KEY", ev.key);
}
function fill_reference_tables() {
  body = "<tr>"
  for(i in LIST_OUTER) {
    if(i % 6 == 0 && i > 0) {
      body += "</tr><tr>";
    }
    k = LIST_OUTER[i];
    body += "<td><canvas id='outer_"+k+"' width=\"" + (2+W) + "\" height=\"" + (2+H) + "\"></canvas></td><td><sub style='color:grey;border:1px;'>" + KEYS_OUTER[i] + "</sub> " + OUTER_MAPPING[k] + "</td>";
  }
  body += "</tr>";
  document.getElementById("mappings_outer").innerHTML = body;

  body = "<tr>"
  for(i in LIST_INNER) {
    if(i % 6 == 0 && i > 0) {
      body += "</tr><tr>";
    }
    k = LIST_INNER[i];
    body += "<td><canvas id='inner_"+k+"' width=\"" + (2+W) + "\" height=\"" + (2+H) + "\"></canvas></td><td><sub style='color:grey;border:1px;'>" + KEYS_INNER[i] + "</sub> " + INNER_MAPPING[k] + "</td>";
  }
  body += "</tr>";
  document.getElementById("mappings_inner").innerHTML = body;

  for(i in LIST_OUTER) {
    k = LIST_OUTER[i];
    ctx = document.getElementById("outer_"+k).getContext("2d");
    draw_character(ctx, 1,1, new Character(k, 0));
  }
  for(i in LIST_INNER) {
    k = LIST_INNER[i];
    ctx = document.getElementById("inner_"+k).getContext("2d");
    draw_character(ctx, 1,1, new Character(0, k));
  }
}
function init() {
  if(window.location.hash) {
    ents = window.location.hash.substring(1).split(',');
    for(e in ents) {
      if(ents[e].length == 0) continue;
      ch = new Character();
      ch.decode_from(ents[e]);
      text.push(ch);
    }
    insert_pos = text.length*2;
  }

  fill_reference_tables();
  update_entry(current_ch);
  update_rendered();
}
function onresize(event) {
  document.getElementById('rendered').width = window.innerWidth - 20;
  update_rendered();
}

