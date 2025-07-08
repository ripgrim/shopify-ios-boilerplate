import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let entry = SimpleEntry(date: Date())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct ShopifyWidgetEntryView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "bag.fill")
                .font(.system(size: 24))
                .foregroundColor(Color("text"))
            
            Text("EDS")
                .font(.headline)
                .fontWeight(.bold)
                .foregroundColor(Color("text"))
                .multilineTextAlignment(.center)
            
            Text("Tap to shop")
                .font(.caption)
                .foregroundColor(Color("text"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color("background").opacity(0.5))
        .widgetURL(URL(string: "shop.60857843806.app://"))
    }
}

struct ShopifyWidget: Widget {
    let kind: String = "ShopifyWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            ShopifyWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Epoc Dev Store")
        .description("Quick access to your store")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

#Preview(as: .systemSmall) {
    ShopifyWidget()
} timeline: {
    SimpleEntry(date: .now)
}
