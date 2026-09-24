from ortools.sat.python import cp_model

def solve_group_trip(travelers: dict, destinations: dict) -> dict:
    model = cp_model.CpModel()
    selected = {d: model.NewBoolVar(f"selected_{d}") for d in destinations}
    model.Add(sum(selected.values()) == 1)

    for dest, info in destinations.items():
        for name, t in travelers.items():
            if info["cost"] > t["budget_max"]:
                model.Add(selected[dest] == 0)
            overlaps = not (info["avail_end"] < t["date_start"] or t["date_end"] < info["avail_start"])
            if not overlaps:
                model.Add(selected[dest] == 0)

    match_score = {
        dest: sum(1 for t in travelers.values() if info["tags"] & t["interests"])
        for dest, info in destinations.items()
    }
    model.Maximize(sum(selected[d] * match_score[d] for d in destinations))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for d in destinations:
            if solver.Value(selected[d]) == 1:
                return {"chosen": d, "cost": destinations[d]["cost"], "match_score": match_score[d]}
    return {"chosen": None, "reason": "No feasible destination found"}