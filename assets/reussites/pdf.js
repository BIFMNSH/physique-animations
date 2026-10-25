/* NohobaLab · générateur PDF minimal (A4, texte, Helvetica / Helvetica-Bold, sans dépendance).
   Les accents passent par l'encodage WinAnsi. Largeurs : métriques Helvetica (codes 32 à 255, en 1/1000 em). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.NLPdf = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var W = { R: [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 761, 556, 761, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 761, 611, 761, 761, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 761, 500, 667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500], B: [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 761, 556, 761, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 761, 611, 761, 761, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 761, 500, 667, 278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556] };
  var SPEC = { '€': 128, '…': 133, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, 'Œ': 140, 'œ': 156, 'Š': 138, 'š': 154, 'Ž': 142, 'ž': 158, 'Ÿ': 159, ' ': 32, ' ': 32 };
  var PW = 595.28, PH = 841.89;

  function codes(s) {
    var out = [];
    for (var ch of String(s)) {
      var c = ch.codePointAt(0), b;
      if (SPEC[ch] !== undefined) b = SPEC[ch]; else if (c >= 32 && c < 127) b = c; else if (c >= 160 && c <= 255) b = c; else b = 63;
      out.push(b);
    }
    return out;
  }
  function width(s, size, bold) { var t = bold ? W.B : W.R, w = 0; codes(s).forEach(function (b) { w += t[b - 32] || 0; }); return w * size / 1000; }
  function esc(s) { return codes(s).map(function (b) { var ch = String.fromCharCode(b); return ch === '(' || ch === ')' || ch === '\\' ? '\\' + ch : ch; }).join(''); }

  /* Découpe un texte en lignes qui tiennent dans maxW ; coupe un mot trop long caractère par caractère. */
  function wrap(text, size, bold, maxW) {
    var lines = [], cur = '';
    String(text).split(/\s+/).filter(Boolean).forEach(function (word) {
      while (width(word, size, bold) > maxW) {
        var k = 1; while (k < word.length && width(word.slice(0, k + 1), size, bold) <= maxW) k++;
        if (cur) { lines.push(cur); cur = ''; }
        lines.push(word.slice(0, k)); word = word.slice(k);
      }
      var t = cur ? cur + ' ' + word : word;
      if (width(t, size, bold) <= maxW) cur = t; else { lines.push(cur); cur = word; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function hex(c) { return c.map(function (v) { return (v / 255).toFixed(3); }).join(' '); }

  function Page() { this.ops = []; }
  Page.prototype.text = function (x, y, s, size, bold, rgb) { this.ops.push('BT /' + (bold ? 'F2' : 'F1') + ' ' + size + ' Tf ' + hex(rgb || [14, 22, 42]) + ' rg ' + x.toFixed(2) + ' ' + (PH - y).toFixed(2) + ' Td (' + esc(s) + ') Tj ET'); };
  Page.prototype.rect = function (x, y, w, h, fill, stroke) { this.ops.push((fill ? hex(fill) + ' rg ' : '') + (stroke ? hex(stroke) + ' RG 0.8 w ' : '') + x.toFixed(2) + ' ' + (PH - y - h).toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2) + ' re ' + (fill && stroke ? 'B' : fill ? 'f' : 'S')); };
  Page.prototype.line = function (x1, y1, x2, y2, rgb, wd) { this.ops.push(hex(rgb) + ' RG ' + (wd || 1) + ' w ' + x1.toFixed(2) + ' ' + (PH - y1).toFixed(2) + ' m ' + x2.toFixed(2) + ' ' + (PH - y2).toFixed(2) + ' l S'); };

  function assemble(pages, meta) {
    var objs = [], add = function (s) { objs.push(s); return objs.length; };
    add('<< /Type /Catalog /Pages 2 0 R >>');
    add(''); // pages, rempli plus bas
    var f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    var f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    var info = add('<< /Title (' + esc(meta.title) + ') /Author (NohobaLab) /Producer (NohobaLab) >>');
    var kids = [];
    pages.forEach(function (p) {
      var stream = p.ops.join('\n'), c = add('<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream');
      kids.push(add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /Font << /F1 ' + f1 + ' 0 R /F2 ' + f2 + ' 0 R >> >> /Contents ' + c + ' 0 R >>'));
    });
    objs[1] = '<< /Type /Pages /Kids [' + kids.map(function (k) { return k + ' 0 R'; }).join(' ') + '] /Count ' + kids.length + ' >>';
    var out = '%PDF-1.4\n', off = [];
    objs.forEach(function (o, i) { off.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    var xref = out.length;
    out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + off.map(function (o) { return ('0000000000' + o).slice(-10) + ' 00000 n \n'; }).join('');
    out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R /Info ' + info + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    var bytes = new Uint8Array(out.length);
    for (var i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
    return bytes;
  }

  var ORANGE = [194, 65, 12], INK = [14, 22, 42], MIST = [80, 90, 112], LINE = [201, 208, 222];
  var ML = 64, CW = PW - 2 * ML;

  function dateFr(d) { return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }

  /* Mise en page d'un document issu de NLReussites.document(). */
  function creer(doc) {
    var pages = [], p, y;
    function nouvelle() {
      p = new Page(); pages.push(p);
      p.rect(28, 28, PW - 56, PH - 56, null, LINE);
      p.rect(ML, 58, 26, 26, ORANGE); p.text(ML + 7.5, 77, 'N', 17, true, [255, 255, 255]);
      p.text(ML + 36, 77, 'NohobaLab', 17, true, INK);
      p.text(PW - ML - width('Physique-chimie · Collège', 10, false), 76, 'Physique-chimie · Collège', 10, false, MIST);
      p.line(ML, 100, PW - ML, 100, ORANGE, 1.5);
      y = 150;
    }
    function bloc(txt, size, bold, rgb, gap, centre) {
      wrap(txt, size, bold, CW).forEach(function (l) {
        if (y > PH - 120) { nouvelle(); }
        p.text(centre ? (PW - width(l, size, bold)) / 2 : ML, y, l, size, bold, rgb); y += size * 1.35;
      });
      y += gap || 0;
    }
    nouvelle();
    bloc(doc.nature, 28, true, INK, 26);
    var cert = doc.type === 'certificat';
    bloc(cert ? 'NohobaLab atteste que les compétences ci-dessous ont été évaluées et validées pour :' : doc.type === 'reussite' ? 'NohobaLab atteste que :' : 'NohobaLab atteste la participation de :', 12.5, false, MIST, 10);
    var size = 24; while (size > 14 && wrap(doc.eleve, size, true, CW).length > 1) size -= 2;
    bloc(doc.eleve, size, true, INK, 14);
    if (doc.type === 'reussite') bloc('a réussi le parcours ci-dessous : toutes les activités ont été terminées et tous les quiz de sortie ont été réussis (' + doc.bilan.quiz + ' sur ' + doc.bilan.total + ' leçons).', 12.5, false, INK, 16);
    else if (doc.type === 'participation') bloc('a terminé les activités du parcours ci-dessous (' + doc.bilan.activites + ' leçons sur ' + doc.bilan.total + '). Ce document atteste la participation ; il n’atteste ni la réussite aux évaluations ni l’acquisition de compétences.', 12.5, false, INK, 16);
    var rows = [['Parcours', doc.parcours], ['Niveau scolaire', 'Classe de ' + doc.niveau], ['Nature du document', doc.nature], ['Délivré le', dateFr(doc.date)], ['Émetteur', doc.emetteur]];
    rows.forEach(function (r) {
      var ls = wrap(r[1], 12, false, CW - 150);
      if (y > PH - 130) nouvelle();
      p.text(ML, y, r[0], 10.5, true, MIST);
      ls.forEach(function (l, i) { p.text(ML + 150, y + i * 16, l, 12, false, INK); });
      y += Math.max(1, ls.length) * 16 + 8; p.line(ML, y - 12, PW - ML, y - 12, LINE, .6);
    });
    y += 10;
    if (cert) {
      bloc('Compétences validées', 14, true, INK, 6);
      doc.competences.forEach(function (c) {
        var ls = wrap(c.competence, 12, true, CW - 200);
        if (y > PH - 130) nouvelle();
        ls.forEach(function (l, i) { p.text(ML, y + i * 16, l, 12, true, INK); });
        p.text(PW - ML - width(c.niveauTexte || 'niveau non renseigné', 11, false), y, c.niveauTexte || 'niveau non renseigné', 11, false, c.niveauTexte ? ORANGE : MIST);
        y += ls.length * 16 + 8; p.line(ML, y - 12, PW - ML, y - 12, LINE, .6);
      });
      y += 8;
    }
    var note = 'Document établi à partir des données enregistrées sur l’appareil de l’élève et du nom qu’il a indiqué. Il n’a pas été vérifié par un tiers : NohobaLab n’est pas un organisme de certification et ce document n’a pas de valeur officielle.';
    if (y > PH - 130) nouvelle();
    var ny = PH - 110; wrap(note, 9.5, false, CW).forEach(function (l, i) { p.text(ML, ny + i * 13, l, 9.5, false, MIST); });
    return assemble(pages, { title: doc.nature + ' · ' + doc.eleve });
  }

  return { creer: creer, wrap: wrap, width: width, codes: codes, esc: esc };
});
