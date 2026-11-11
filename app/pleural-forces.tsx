export default function PleuralForces() {
  return <section className="pleural-forces-block" aria-labelledby="pleural-forces-heading">
    <h3 id="pleural-forces-heading">Kohäsions- und Adhäsionskräfte bei der Atmung</h3>
    <p>Zwischen Lungenfell und Rippenfell liegt ein sehr dünner Flüssigkeitsfilm. Seine molekularen Kräfte ermöglichen, dass die Lunge der Bewegung des Brustkorbs folgt und beide Pleurablätter trotzdem reibungsarm gegeneinander gleiten.</p>
    <div className="broncho-gas-card">
      <div className="broncho-gas-heading"><small>Atemmechanik · Lerntabelle</small><h3>Pleuraspalt und Alveolen unterscheiden</h3></div>
      <table>
        <thead><tr><th scope="col">Begriff</th><th scope="col">Was bedeutet das?</th><th scope="col">Wirkung bei der Atmung</th></tr></thead>
        <tbody>
          <tr><th scope="row">Adhäsion</th><td>Anziehung zwischen unterschiedlichen Stoffen: Pleuraflüssigkeit und Pleurablätter.</td><td>Der Flüssigkeitsfilm haftet an beiden Pleurablättern. Dadurch folgt die Lunge der Thoraxbewegung.</td></tr>
          <tr><th scope="row">Kohäsion</th><td>Anziehung zwischen gleichartigen Flüssigkeitsmolekülen.</td><td>Der zusammenhängende Flüssigkeitsfilm stabilisiert die mechanische Kopplung und erlaubt zugleich reibungsarmes Gleiten.</td></tr>
          <tr><th scope="row">Intrapleuraler Druck</th><td>Der Druck im Pleuraspalt ist normalerweise gegenüber der Umgebung negativ.</td><td>Er entsteht vor allem durch die gegensinnigen elastischen Rückstellkräfte von Lunge und Brustkorb und unterstützt, dass die Lunge entfaltet bleibt.</td></tr>
          <tr><th scope="row">Surfactant</th><td>Ein oberflächenaktiver Film auf der Innenseite der Alveolen.</td><td>Er vermindert dort die durch Kohäsion entstehende Oberflächenspannung und wirkt einem Alveolenkollaps entgegen.</td></tr>
        </tbody>
      </table>
    </div>
    <aside className="knowledge-note"><b>Prüfungsabgrenzung</b><p><b>Pleuraspalt:</b> Adhäsion, Kohäsion und negativer intrapleuraler Druck koppeln Lunge und Thorax. <b>Alveole:</b> Kohäsion der Flüssigkeitsmoleküle erzeugt Oberflächenspannung; Surfactant senkt sie.</p></aside>
  </section>;
}
