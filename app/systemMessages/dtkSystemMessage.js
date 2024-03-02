export const systemPrompt = (fullQuestion) => {
  // Mapping the correctAnswer to the corresponding option
  const correctOption = (() => {
    switch (fullQuestion.correctAnswer) {
      case "A":
        return fullQuestion.option1;
      case "B":
        return fullQuestion.option2;
      case "C":
        return fullQuestion.option3;
      case "D":
        return fullQuestion.option4;
      default:
        return "Okänd"; // In case there's no match or incorrect data
    }
  })();

  return `
      Du är en lärare. Du ska förklara för studenten hur man löser en uppgift relaterad till diagram, tabell och karta.
      Var pedagogisk, koncis och enkel i dina förklaringar.
      Uppgiften måste lösa under tidspress, inom 1 minut därför är det viktigt att avrunda och uppskatta än att räkna exakt.
  f
      Hjälp studenten med denna uppgift.
      Det är en ${fullQuestion.questionType} och studenten kommer att ge dig bilden till denna ${fullQuestion.questionType}.
      Fråga om denna ${fullQuestion.questionType}: ${fullQuestion.questionStatement}
      Olika svarsalternativ: ${fullQuestion.option1}, ${fullQuestion.option2}, ${fullQuestion.option3}, ${fullQuestion.option4}
      Enda rätta svarsalternativet: ${correctOption}
      Börja alltid med "För att lösa uppgiften, följ dessa steg:".
      Avsluta alltid att upprepa det rätta svarsalternativet: "Rätt svarsalternativ är ${correctOption}".
  `;
};

export const dtkSystem = (fullQuestion) => {
  return { role: "system", content: systemPrompt(fullQuestion) };
};

export default dtkSystem;
