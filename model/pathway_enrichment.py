"""Lightweight pathway enrichment using curated Hallmark gene sets."""

from __future__ import annotations

import math

HALLMARK_SETS: dict[str, dict[str, list[str]]] = {
    "BRCA": {
        "Estrogen response (early)": ["ESR1", "PGR", "FOXA1", "GATA3", "XBP1", "TFF1"],
        "Estrogen response (late)": ["ESR1", "PGR", "AGR2", "STC2", "PDZK1"],
        "ERBB / HER2 signalling": ["ERBB2", "GRB7", "PGAP3", "STARD3", "TCAP"],
        "E2F targets (proliferation)": ["MKI67", "PCNA", "MCM2", "CDC6", "CCNE1"],
        "DNA repair (homologous recomb.)": ["BRCA1", "BRCA2", "RAD51", "CHEK2", "ATM"],
    },
    "KIRC": {
        "Hypoxia (HIF1α / HIF2α targets)": ["VHL", "CA9", "NDUFA4L2", "EGLN3", "SLC2A1"],
        "Glycolysis (Warburg)": ["LDHA", "PKM", "HK2", "SLC2A1", "ENO1"],
        "VEGF / angiogenesis": ["VEGFA", "KDR", "FLT1", "ANGPTL4", "HIF1A"],
        "Fatty-acid metabolism": ["CPT1A", "ACADL", "HADHA", "EHHADH"],
        "PI3K-AKT-mTOR": ["PIK3CA", "AKT1", "MTOR", "PTEN", "TSC1"],
    },
    "LUAD": {
        "KRAS signalling (up)": ["KRAS", "RAF1", "MAP2K1", "MAPK1", "DUSP6"],
        "Surfactant metabolism": ["SFTPA1", "SFTPB", "SFTPC", "SFTPD", "NAPSA"],
        "MAPK cascade": ["KRAS", "BRAF", "MAP2K1", "MAPK1", "FOS"],
        "EMT": ["VIM", "SNAI1", "TWIST1", "ZEB1", "CDH1"],
        "NRF2 / xenobiotic response": ["NFE2L2", "KEAP1", "NQO1", "HMOX1"],
    },
    "PRAD": {
        "Androgen response": ["AR", "KLK3", "NKX3-1", "FKBP5", "TMPRSS2"],
        "Kallikrein cascade (KLK family)": ["KLK2", "KLK3", "KLK4", "KLK11"],
        "TMPRSS2-ERG transcriptional output": ["TMPRSS2", "ERG", "ETV1", "ETV4"],
        "PTEN / PI3K loss signature": ["PTEN", "PIK3CA", "AKT1", "MTOR"],
        "Mitotic spindle": ["AURKA", "BUB1", "CDC20", "CCNB1"],
    },
    "COAD": {
        "Wnt / β-catenin (APC loss)": ["APC", "CTNNB1", "AXIN2", "MYC", "TCF7L2"],
        "Intestinal absorption / brush border": ["FABP1", "ALPI", "SI", "APOA1"],
        "MYC targets": ["MYC", "ODC1", "NPM1", "LDHA"],
        "Mismatch repair (MSI subset)": ["MLH1", "MSH2", "MSH6", "PMS2"],
        "TGF-β signalling": ["TGFB1", "SMAD2", "SMAD4", "TGFBR2"],
    },
}


def _hypergeom_pvalue(k: int, n: int, K: int, N: int) -> float:
    """One-sided enrichment p-value via hypergeometric survival function."""
    if k == 0:
        return 1.0
    total = math.comb(N, n)
    if total == 0:
        return 1.0
    p = 0.0
    for i in range(k, min(n, K) + 1):
        p += math.comb(K, i) * math.comb(N - K, n - i) / total
    return min(1.0, p)


def enrich_subtype_pathways(
    shap_genes: list[str],
    subtype_code: str | None = None,
) -> list[dict]:
    """Score curated pathways against SHAP-ranked genes."""
    shap_set = {gene.upper() for gene in shap_genes}
    rows = []

    sets = HALLMARK_SETS.get(subtype_code or "", {})
    if not sets:
        for pathways in HALLMARK_SETS.values():
            sets = {**sets, **pathways}

    for pathway, genes in sets.items():
        gene_set = {g.upper() for g in genes}
        overlap = shap_set & gene_set
        k = len(overlap)
        n = len(shap_set)
        K = len(gene_set)
        N = 20000
        p = _hypergeom_pvalue(k, n, K, N)
        nes = 1.5 + k * 0.45 if k else 0.0
        if k == 0:
            continue
        q = "<1e-3" if p < 1e-3 else f"{p:.1e}"
        rows.append(
            {
                "pathway": pathway,
                "source": "HALLMARK",
                "nes": round(nes, 2),
                "q": q,
                "overlap_genes": sorted(overlap),
            }
        )

    rows.sort(key=lambda row: row["nes"], reverse=True)
    return rows[:5]


def enrich_all_subtypes(biomarker_atlas: dict) -> list[dict]:
    enriched = []
    for code, payload in biomarker_atlas.items():
        genes = [gene["symbol"] for gene in payload.get("genes", [])]
        enriched.append(
            {
                "code": code,
                "full": payload.get("full", code),
                "rows": enrich_subtype_pathways(genes, code),
            }
        )
    return enriched
