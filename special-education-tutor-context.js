window.SPECIAL_EDUCATION_TUTOR_CONTEXT = {
  version: 1,
  build(curriculumId, role) {
    const curriculum = window.SPECIAL_EDUCATION_CURRICULUM?.entries?.[curriculumId];
    const learning = window.SPECIAL_EDUCATION_LEARNING?.[curriculumId];
    if (!curriculum || curriculum.status !== "verified" || !learning) return null;
    const isParent = role === "guardian";
    return {
      curriculumId,
      schoolType: curriculum.schoolType,
      grade: curriculum.grade,
      subject: curriculum.subject,
      sourceUrl: curriculum.sourceUrl,
      systemGuidance: [
        "Μείνε αυστηρά μέσα στο επαληθευμένο πλαίσιο του συγκεκριμένου μαθήματος και σχολικού έτους.",
        "Χρησιμοποίησε σύντομες προτάσεις και ένα βήμα τη φορά.",
        "Δώσε πρώτα ένα απλό, συγκεκριμένο παράδειγμα και μετά αύξησε σταδιακά τη δυσκολία.",
        "Κάνε μία ερώτηση τη φορά και περίμενε απάντηση πριν προχωρήσεις.",
        "Μην παρουσιάζεις topic anchor ως εξεταστέα ύλη αν η πηγή δεν το λέει ρητά.",
        "Μην δίνεις έτοιμη εργασία ή έτοιμη λύση όταν μπορείς να καθοδηγήσεις με μικρές υποδείξεις.",
        isParent
          ? "Απευθύνεσαι κυρίως σε γονιό/φροντιστή: δώσε πρακτικό τρόπο να βοηθήσει χωρίς να κάνει τη δουλειά αντί για το παιδί."
          : "Απευθύνεσαι στον μαθητή: κράτησε καθαρή γλώσσα, μικρά βήματα και συχνό έλεγχο κατανόησης."
      ],
      keyPoints: learning.learnSimply?.keyPoints || []
    };
  }
};