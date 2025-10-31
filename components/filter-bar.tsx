"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface FilterBarProps {
  selectedObjectives: string[]
  onObjectivesChange: (objectives: string[]) => void
  selectedCity: string
  onCityChange: (city: string) => void
  cities: string[]
}

const objectives = [
  { value: "Exchange", label: "Troca" },
  { value: "Donation", label: "Doação" },
  { value: "Loan", label: "Empréstimo" },
]

const objectiveColors: Record<string, string> = {
  Exchange: "cursor-pointer bg-primary/10 text-primary hover:bg-primary/20",
  Donation: "cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  Loan: "cursor-pointer bg-green-100 text-green-700 hover:bg-green-200",
}

export function FilterBar({
  selectedObjectives,
  onObjectivesChange,
  selectedCity,
  onCityChange,
  cities,
}: FilterBarProps) {
  const toggleObjective = (objective: string) => {
    if (selectedObjectives.includes(objective)) {
      onObjectivesChange(selectedObjectives.filter((o) => o !== objective))
    } else {
      onObjectivesChange([...selectedObjectives, objective])
    }
  }

  const clearFilters = () => {
    onObjectivesChange([])
    onCityChange("")
  }

  const hasActiveFilters = selectedObjectives.length > 0 || selectedCity

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filtros</span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto h-7 text-xs">
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Objectives Filter */}
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Objetivos</label>
          <div className="flex flex-wrap gap-2">
            {objectives.map((objective) => (
              <Badge
                key={objective.value}
                variant={selectedObjectives.includes(objective.value) ? "default" : "outline"}
                className={objectiveColors[objective.value]}
                onClick={() => toggleObjective(objective.value)}
              >
                {objective.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* City Filter */}
        <div className="sm:w-48">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Cidade</label>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}